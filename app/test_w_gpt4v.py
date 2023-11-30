import base64
import streamlit as st
from dotenv import load_dotenv
import os
import requests
from PIL import Image
import io
import pyperclip
import json

load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")

# Function to encode the image
# @st.cache_data
def encode_image(image):
    buffered = io.BytesIO()
    image.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode('utf-8')

# Placeholder code
placeholder_code = """
//Placeholder code
import React from "react";
import {
  Card,
  Grid,
  Typography,
  Button,
  IconButton,
  Divider,
} from "@material-ui/core";
import { PlayCircleOutline } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
}));
"""

# Upload image file
with st.spinner('Uploading...'):
    image_file = st.sidebar.file_uploader("Upload an image", type=['jpg', 'jpeg', 'png'])

st.title('Material UI React Component Generator')
prompt = "Create a React component using Material-UI that resembles the uploaded image. Try to match the colors, fonts, text justification, spacing, etc. This is to be ready for production."
user_input = st.text_area("Describe your component", value=prompt)

if image_file is not None:
    # Open the image file
    image = Image.open(image_file)
    # Encode the image
    base64_image = encode_image(image)

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {openai_api_key}"
    }

    payload = {
        "model": "gpt-4-vision-preview",
        "messages": [
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": user_input
              },
              {
                "type": "image_url",
                "image_url": {
                  "url": f"data:image/jpeg;base64,{base64_image}"
                }
              }
            ]
          }
        ],
        "max_tokens": 1400
    }
  
    # Initialize a variable to track if the button has been clicked
    # This variable should be set outside of the if block to persist its state
   
    if st.sidebar.button('Generate React Component'):
        
        with st.spinner('Generating...'):
            response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload, stream=True)
            if response.status_code == 200:
                response_text = response.text.strip()
                if response_text:
                    try:
                        json_response = json.loads(response_text)
                        # Process the JSON response
                        generated_code = json_response['choices'][0]['message']['content']
                        st.code(generated_code, language='python')
                    except json.JSONDecodeError as e:
                        st.error(f"JSON decode error: {e}")
                else:
                    st.error("Received an empty response.")
            else:
                st.error(f"Failed to generate code: {response.status_code} - {response.text}")

    # ... rest of the code ...

