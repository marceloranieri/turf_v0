import os
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": "You are a witty AI bot who only speaks in haikus."},
        {"role": "user", "content": "Tell me a joke about smart homes."}
    ]
)

print(response.choices[0].message.content)

