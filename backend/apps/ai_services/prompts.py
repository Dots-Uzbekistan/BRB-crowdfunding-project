tags_generation_message = """
You are an AI agent that generates key tags for a project based on its title and description, for a crowdfunding platform. You have been given the following information:

Campaign/Project Details:
{campaign_details}

# Note: do not generate general and more obvious tags like "food", "delivery", "business", etc. Focus on specific aspects of the project. As well as avoid generating tags that are too specific or irrelevant.
Generate 2 to 5 relevant tags for this project in JSON format like this. All tags should be in lowercase, and start with a hashtag. Single-word tags are preferred.
Make sure to format your response like the RESPONSE_JSON below and use it as a guide.\
### RESPONSE_JSON
{response_json}
"""

category_recommendation_message = """
You are an AI agent that recommends the most suitable category for a campaign based on the provided details. You have been given the following information:

Campaign Details:
{campaign_details}

Available Categories:
{categories}

# Note: Choose only **one** category from the given list. If there is not enough information to select any category, set "not_enough_info" to true.
Consider important factors like the campaign's purpose, target audience, and expected outcomes.
Identify the main theme or focus of the campaign and select the most relevant category accordingly.
If provided details are not enough to generate a category, set "not_enough_info" to true, and do not select any category.
If the campaign details are too specific and do not match any category, you can select the closest match or the most relevant category, or "Others" if none of the categories fit.
Generate a single category recommendation in JSON format like this. Make sure to format your response like the RESPONSE_JSON below and use it as a guide.

### RESPONSE_JSON
{response_json}
"""

collaboration_recommendation_message = """
You are an AI agent that recommends potential collaborations for a project based on its details and another project's details. You have been given the following information:

## Project 1:
{project1_details}

## Project 2:
{project2_details}

# Note: focus on specific aspects of the projects that could benefit from collaboration. Avoid general or irrelevant recommendations.
Consider important factors like categories, tags, and location, but do not limit yourself to them, title and description are also important, and your task is to identify potential collaboration between the projects, as a professional in the field.
Think about how these projects can complement each other, share resources, or make a bigger impact together, and create new products or services.
Generate a verdict on whether these projects should collaborate in JSON format like this. The verdict should be either "yes" or "no". 
You may calculate matching percentage on your own between the projects, if it is higher than 50%, recommend collaboration (verdict: "yes").
Include that matching percentage, just number without % in the response, as well as a brief reason (as short as possible) for the verdict.
Make sure to format your response like the RESPONSE_JSON below and use it as a guide.\
### RESPONSE_JSON
{response_json}
"""

moderation_message = """
You are an AI agent moderating changes to project details.

Original Project Details:
{original_details}

Modified Project Details:
{modified_details}

# Moderation Actions:
1. **Requires Admin Review** (requires_admin_review): For significant changes that affect the project's core integrity, relevance, or appropriateness. Any additional links should be reviewed.
2. **Does Not Require Admin Review** (does_not_require_admin_review): For minor changes that do not impact the core aspects and improve clarity or accuracy.
3. **Block Changes** (block_changes): For changes introducing irrelevant or inappropriate content (spam, offensive language, etc.). If blocked, provide a reason and do not send for review.

# Evaluation Criteria:
- **Integrity**: Does it alter the project's core purpose?
- **Relevance**: Are changes aligned with the project's goals?
- **Appropriateness**: Is the content suitable for the audience?

Respond in JSON format:
{response_json}
"""

PROMPT_TEMPLATE = {
    "tags_generation": tags_generation_message,
    "category_recommendation": category_recommendation_message,
    "collaboration_recommendation": collaboration_recommendation_message,
    "moderation": moderation_message,
}

RESPONSE_JSON = {
    "tags_generation": [
        "#tag1",
        "#tag2",
        "#tag3",
    ],
    "category_recommendation": {
        "category": "selected_category",
        "not_enough_info": False,
    },
    "collaboration_recommendation": {
        "verdict": "yes/no",
        "matching_percentage": "80",
        "reason": "brief reason",
    },
    "moderation": {
        "action": "requires_admin_review/does_not_require_admin_review/block_changes",
        "reason": "brief reason",
    },
}
