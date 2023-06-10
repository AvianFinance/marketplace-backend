from converters.json_solidity import json_to_solidity

file_path = "sell_logic.txt"

contract_name = "AvianSellExchange"

function_str_list = json_to_solidity(contract_name,"sell-logic")

with open(file_path, 'w') as file:
    for section in function_str_list:
        file.write(section + "\n")


