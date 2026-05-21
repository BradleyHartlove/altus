# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "prettytable>=3.17.0",
#     "pydantic>=2.13.4",
#     "requests>=2.34.2",
# ]
# ///
import requests
from requests.exceptions import HTTPError
from prettytable import PrettyTable
from pydantic import BaseModel
import json

WELCOME_MESSAGE = r"""
  ___  _   _           
 / _ \| | | |          
/ /_\ \ |_| |_   _ ___ 
|  _  | __| | | | / __|
| | | | |_| | |_| \__ \
\_| |_/\__|_|\__,_|___/
                       
                       

Welcome to Atlus CLI! You can use this
prompt to manage your church parishioners
with the following commands:

list --> List all the parishioners
get <ID> --> Get a parishioner by ID
post --> Create a parishioner (will be prompted with options)
delete <ID> --> Delete a parishioner by ID

exit --> Exit at any time!
"""

BASE_URL = "http://localhost:8080"


'''
type Parishioner struct {
	ID           string `json:"id,omitempty"`
	Name         string `json:"name" binding:"required"`
	City         string `json:"city" binding:"required"`
	Status       string `json:"status" binding:"required"`
	Email        string `json:"email" binding:"required"`
	IsRegistered *bool  `json:"is_registered" binding:"required"`
	Members      int    `json:"members" binding:"required,gte=1"`
}
'''
class Parishioner(BaseModel):
    id: str
    name: str
    city: str
    status: str
    email: str
    is_registered: bool
    members: int


def _process_exit():
    print("\nHave a great day!\n")
    exit(0)


def _process_list():
    try:
        response = requests.get(f"{BASE_URL}/parishioners")
        response.raise_for_status()

        data = [
            Parishioner(**elem) for elem in response.json().get("parishioners")
        ]
        
        table = PrettyTable()
        table.field_names = [f.alias or name for name, f in Parishioner.model_fields.items()]
        
        for elem in data:
            table.add_row([getattr(elem, name) for name in Parishioner.model_fields])
        print(table)
    except HTTPError as e:
        print(f"[!] Error: Encountered an HTTP error while trying to list parishioners: {e}")
    except Exception as e:
        print(f"[!] Error: Encountered an unknown error while trying to list parishioners: {e}")

def main():
    # Enter the main processing loop
    print(WELCOME_MESSAGE)

    while True:
        user_input = input("> ")

        # Process the input
        match user_input:
            case "exit":
                _process_exit()
            case "list":
                _process_list()

if __name__ == "__main__":
    main()
