

# Prints a greeting as indication that the Tiltfile has started

print("Ciao!")

if os.getenv('HONEYCOMB_API_KEY') == None:
    print("API key not set. Exiting.....")
    exit()
else: 
    os.getenv('HONEYCOMB_API_KEY')
    print(os.environ['HONEYCOMB_API_KEY'])

# if os.getenv('HONEYCOMB_DATASET_NAME') == None:
#     os.environ['HONEYCOMB_DATASET_NAME'] = 'prometheus-go'
#     print("Dataset name was not set. Setting to", os.environ['HONEYCOMB_DATASET_NAME'] )
# else:
#     print("Dataset is already set to", os.environ['HONEYCOMB_DATASET_NAME'] )


docker_compose("./docker-compose.yml", env_file="./app/.env")