def change_list(list_1, list_2):
    list_1.append("four")
    #list_2 = ["and", "we", "do", "not", "lie"]
    list_3 = ["and", "we", "do", "not", "fail"]
    list_2 = list_2 + list_3

out_list_1 = ["one", "two", "three"]
out_list_2 = ["we", "like", "porper", "English"]

change_list(out_list_1, out_list_2)

print(out_list_1)
print(out_list_2)

