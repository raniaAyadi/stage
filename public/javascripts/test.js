function        nMLongTexts_rules(nMLongTexts)
{
    let j;
    let rules = [];

    for (let i = 0; nMLongTexts[i] != undefined; ++j)
    {
	if (nMLongTexts[i].rules != undefined)
 	{
	    for (i = 0; nMLongTexts[i].rules[j] != undefined; ++i)
 	    {
		if (nMLongTexts[i].rules[j].expression[0] == "set")
 		{
		    if (Array.isArray(nMLongTexts[i].rules[j].expression[2]) == true)
		    {
			tab_rules(nMLongTexts[i].id, 'nMtexts', nMLongTexts[i].rules[j].expression[1], nMLongTexts[i].rules[j].expression[2]);
		    }
		    else
		    {
			globalVariables[nMLongTexts[i].rules[j].expression[1]] = (nMLongTexts[i].rules[j].expression[2] == "$answer" ?
										  list_value('nMLongTexts', nMLongTexts[i].length, nMLongTexts[i].id)  : nMLongTexts[i].rules[j].expression[2]);
		    }
 		}
		else if (nMLongTexts[i].rules[j].expression[0] == "append")
 		{
		    globalVariables[nMLongTexts[i].rules[j].expression[1]].push(nMLongTexts[i].rules[j].expression[2] == "$answer" ?
										list_value('nMLongTexts', nMLongTexts[i].length, nMLongTexts[i].id) : nMLongTexts[i].rules[j].expression[2]);
 		}
 	    }
 	}
	return (rules);
    }
}
