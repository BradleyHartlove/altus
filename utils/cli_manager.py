# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "prettytable>=3.17.0",
#     "pydantic>=2.13.4",
#     "requests>=2.34.2",
# ]
# ///

'''
This is a development script used for testing
out the Atlus API and is NOT intended to be
used by end users, but for developers for
quick debugging and verification of functionality.
'''


import requests
from requests.exceptions import HTTPError
from prettytable import PrettyTable
from pydantic import BaseModel
from typing import Optional
from enum import Enum

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
get --> Get a parishioner by ID
post --> Create a parishioner
delete --> Delete a parishioner by ID

exit --> Exit at any time!
"""

BASE_URL = "http://localhost:8080"


class Parishioner(BaseModel):
    id: Optional[str] = None
    name: str
    city: str
    email: str
    is_registered: bool
    members: int


def _process_exit():
    print("\nHave a great day!\n")
    exit(0)


def _handle_input(msg: str, valid_inputs: Optional[str] = None):
        while True:
            user_input = input(msg)
            if not user_input or (valid_inputs and user_input not in valid_inputs):
                print("Invalid input. Please enter a valid input.")
                continue
            return user_input


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


def _process_post():
    try:
        p_name = _handle_input(msg="Enter name for parishioner (e.g., John Doe): ")
        p_city = _handle_input(msg="Enter city for parishioner (e.g., Chester): ")
        p_email = _handle_input(msg="Enter email for parishioner (e.g., sally.jane@example.com): ")
        p_is_registered = _handle_input(
            msg="Is this parishioner registered with the Parish [Y/n]: ",
            valid_inputs=["Y", "y", "N", "n"]
        )
        p_members = _handle_input(msg="Enter members for parishioner family (e.g., 5): ")

        new_parishioner = Parishioner(
            name=p_name,
            city=p_city,
            email=p_email,
            is_registered=p_is_registered in ["Y", "y"],
            members=p_members
        ) 
        response = requests.post(f"{BASE_URL}/parishioners", json=new_parishioner.model_dump())
        response.raise_for_status()

        data = Parishioner(**response.json())
        table = PrettyTable()
        table.field_names = [f.alias or name for name, f in Parishioner.model_fields.items()]
        table.add_row([getattr(data, name) for name in Parishioner.model_fields])

        print(table)
    except HTTPError as e:
        print(f"[!] Error: Encountered an HTTP error while trying to create parishioner: {e}")
    except Exception as e:
        print(f"[!] Error: Encountered an unknown error while trying to create parishioner: {e}")


def _process_get():
    try:
        p_id = _handle_input(msg="Enter ID to retrieve: ")
        response = requests.get(f"{BASE_URL}/parishioners/{p_id}")
        response.raise_for_status()

        data = Parishioner(**response.json())
        table = PrettyTable()
        table.field_names = [f.alias or name for name, f in Parishioner.model_fields.items()]
        table.add_row([getattr(data, name) for name in Parishioner.model_fields])

        print(table)
    except HTTPError as e:
        print(f"[!] Error: Encountered an HTTP error while trying to get parishioner: {e}")
    except Exception as e:
        print(f"[!] Error: Encountered an unknown error while trying to get parishioner: {e}")


def _process_delete():
    try:
        p_id = _handle_input(msg="Enter ID to delete: ")
        response = requests.delete(f"{BASE_URL}/parishioners/{p_id}")
        response.raise_for_status()

        print("Successfully deleted parishioner.")
    except HTTPError as e:
        print(f"[!] Error: Encountered an HTTP error while trying to delete parishioner: {e}")
    except Exception as e:
        print(f"[!] Error: Encountered an unknown error while trying to delete parishioner: {e}")


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
            case "get":
                _process_get()
            case "post":
                _process_post()
            case "delete":
                _process_delete()

if __name__ == "__main__":
    main()
