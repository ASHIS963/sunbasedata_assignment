# Python code
import requests

# Authentication endpoint
auth_url = "https://qa2.sunbasedata.com/sunbase/portal/api/assignment_auth.jsp"

# User credentials
login_id = "test@sunbasedata.com"
password = "Test@123"

# Request body
payload = {
    "login_id": login_id,
    "password": password
}

# Make the authentication request
response = requests.post(auth_url, json=payload)

# Check if the request was successful (status code 200)
if response.status_code == 200:
    # Parse the response to get the Bearer token
    token = response.json().get("token")

    # Now you can use this token for further API calls by including it in the Authorization header
    headers = {
        "Authorization": f"Bearer {token}"
    }

    # Example of a subsequent API call using the obtained token
    # Replace 'YOUR_API_ENDPOINT' with the actual API endpoint you want to call
    api_endpoint = "YOUR_API_ENDPOINT"
    response = requests.get(api_endpoint, headers=headers)

    # Handle the response accordingly
    print(response.status_code)
    print(response.json())
else:
    # Handle authentication error
    print(f"Authentication failed. Status code: {response.status_code}")
    print(response.text)
