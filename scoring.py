from openai import OpenAI
import os 
from dotenv import load_dotenv
import json 

load_dotenv()

client = OpenAI(api_key = os.getenv("OPENAI_API_KEY"))


# Basic prompt to check the score
def calculate_score(event, customer):
  prompt = f"""
                You are an expert regulatory intelligence analyst for global manufacturers.

                EVENT:
                Title: {event['title']}
                Description: {event['description']}
                Tags: {event.get('tags', [])}

                CUSTOMER PROFILE:
                Name: {customer['name']}
                Industry: {customer['industry']}
                Products: {customer['products']}
                Key Regions: {', '.join(customer['regions'])}
                Priority Level: {customer.get('priority', 'Medium')}

                Task: Score how relevant and impactful this event is to this specific customer.
                Consider regulatory compliance burden, business risk, market opportunity, and urgency.
                Be critical and realistic.

                Return **only** valid JSON in this exact format (no extra text, no markdown, no explanation):

                {{
                  "score": <integer between 0 and 400>,
                  "reasoning": "<one concise sentence explaining the score>"
                }}
                """
  try:
    response = client.chat.completions.create(
      model="gpt-4o-mini",   # fast and good
      messages=[{"role": "user", "content": prompt}],
      temperature=0.3,
      max_tokens=200
    )
    result = json.loads(response.choices[0].message.content)
    return result["score"], result["reasoning"]
  
  except Exception as e:
    print(f"Error: {e}")
    return 150, "Fallback scoring due to API errors"
  
# Test_1 - Importing from the mockdata
if __name__ == "__main__":
    from mockdata import customers   
    
    test_event = {
        "title": "New EU Battery Regulation",
        "description": "Updated safety and recycling requirements for EV batteries",
        "tags": ["regulation", "EV", "sustainability"]
    }
    
    score, reason = calculate_score(test_event, customers[0])
    print(f"Score: {score}")
    print(f"Reason: {reason}")
  
  
