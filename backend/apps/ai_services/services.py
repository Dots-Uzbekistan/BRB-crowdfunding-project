import json
from typing import Literal

from django.utils.html import format_html
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

from .config import MODEL_NAME
from .models import ModerationLog
from .prompts import PROMPT_TEMPLATE, RESPONSE_JSON
from .schema import TagGenerationOutput, CategoryRecommendationOutput, CollaborationRecommendationOutput, \
    ModerationOutput
from ..campaigns.models import CampaignCategory


class AIService:
    def __init__(self):
        self.llm = ChatOpenAI(model_name=MODEL_NAME)

    def get_structured_llm(self, output_schema, method: Literal["json_mode"] = "json_mode"):
        return self.llm.with_structured_output(output_schema, method=method)


class TagGenerationService(AIService):
    def __init__(self):
        super().__init__()
        self.prompt_template = PROMPT_TEMPLATE['tags_generation']
        self.response_json = json.dumps(RESPONSE_JSON['tags_generation'])

    def generate_tags(self, campaign_details) -> TagGenerationOutput:
        structured_llm = self.get_structured_llm(TagGenerationOutput)
        tag_generation_prompt = PromptTemplate(
            input_variables=["campaign_details", 'response_json'],
            template=self.prompt_template,
            output_key="tags",
        )
        few_shot_structured_llm = tag_generation_prompt | structured_llm
        tags = few_shot_structured_llm.invoke(
            {
                "campaign_details": campaign_details,
                "response_json": self.response_json
            }
        )

        # strip any leading/trailing whitespace from each tag
        tags.tags = [tag.strip() for tag in tags.tags]

        return tags


class CategoryRecommendationService(AIService):
    def __init__(self):
        super().__init__()
        self.prompt_template = PROMPT_TEMPLATE['category_recommendation']
        self.response_json = json.dumps(RESPONSE_JSON['category_recommendation'])
        # self.available_categories = ['Art', 'Education', 'Fintech', 'Healthcare', 'Tech', 'Fashion', 'Nature', 'Others']
        self.available_categories = CampaignCategory.objects.values_list('name', flat=True)

    def recommend_category(self, campaign_details) -> CategoryRecommendationOutput:
        structured_llm = self.get_structured_llm(CategoryRecommendationOutput)
        category_recommendation_prompt = PromptTemplate(
            input_variables=["campaign_details", "categories", 'response_json'],
            template=self.prompt_template,
            output_key="category",
        )
        few_shot_structured_llm = category_recommendation_prompt | structured_llm
        category = few_shot_structured_llm.invoke({
            "campaign_details": campaign_details,
            "categories": self.available_categories,
            "response_json": self.response_json
        })
        return category


class CollaborationRecommendationService(AIService):
    def __init__(self):
        super().__init__()
        self.prompt_template = PROMPT_TEMPLATE['collaboration_recommendation']
        self.response_json = json.dumps(RESPONSE_JSON['collaboration_recommendation'])

    def recommend_collaboration(self, project1_details, project2_details) -> CollaborationRecommendationOutput:
        structured_llm = self.get_structured_llm(CollaborationRecommendationOutput)
        collaboration_recommendation_prompt = PromptTemplate(
            input_variables=["project1_details", "project2_details", 'response_json'],
            template=self.prompt_template,
            output_key="recommendations"
        )
        few_shot_structured_llm = collaboration_recommendation_prompt | structured_llm
        collaboration = few_shot_structured_llm.invoke({
            "project1_details": project1_details,
            "project2_details": project2_details,
            "response_json": self.response_json
        })
        return collaboration


class ModerationService(AIService):
    def __init__(self):
        super().__init__()
        self.prompt_template = PROMPT_TEMPLATE['moderation']
        self.response_json = json.dumps(RESPONSE_JSON['moderation'])

    def moderate_changes(self, campaign, original_details, modified_details) -> ModerationOutput:
        structured_llm = self.get_structured_llm(ModerationOutput)
        moderation_prompt = PromptTemplate(
            input_variables=["original_details", "modified_details", 'response_json'],
            template=self.prompt_template,
            output_key="moderation"
        )
        few_shot_structured_llm = moderation_prompt | structured_llm
        moderation = few_shot_structured_llm.invoke({
            "original_details": original_details,
            "modified_details": modified_details,
            "response_json": self.response_json
        })

        # Create a pretty comparison
        comparison = self.create_pretty_comparison(original_details, modified_details)

        # Save the comparison in ModerationLog
        ModerationLog.objects.create(
            campaign=campaign,
            original_details=original_details,
            modified_details=modified_details,
            comparison=comparison,
            action=moderation.action,
            reason=moderation.reason
        )

        return moderation

    def create_pretty_comparison(self, original_details, modified_details):
        comparison = ""
        for key in original_details:
            original_value = original_details[key]
            modified_value = modified_details.get(key, original_value)
            if original_value != modified_value:
                comparison += f"<b>{key}:</b> <br>Original: {original_value}<br>Modified: {modified_value}<br><br>"
        return format_html(comparison)
