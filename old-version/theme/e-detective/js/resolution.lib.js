/*
Math logic library for resolution-rule task solver.
(c) Konstantin Danilov 2014
http://xomak.net
*/


/*
Defines any logic expression
*/
var LogicExpression=function() 
{
	var that=
	{
		//Returns the value of the expression with given values
		calculate:function()
		{
			alert("Parent calculation");
		},
		/*
		Returns Expression without complex inversions
		*/
		getWithoutComplexInversion:function()
		{
			return that;
		},
		getOperand:function(operandID)
		{
			return false;
		},
		getType:function()
		{
			return "LogicExpression";
		},
		getText:function()
		{
			return "";
		},
		getMath:function()
		{
		
		},
		getVariables:function()
		{
			var variables=new Array();
			that._addVariables(variables);
			return variables;
		},
		getSCNF:function()
		{
			var result=that.getSCNFParts();
			if(result.length==0)
			{
				return LogicTRUE();
			}
			else if(result.length==Math.pow(2,that.getVariables().length))
			{
				return LogicFALSE();
			}
			else
			{
				var expression=false;
				for(var key in result)
				{
					if(!expression) expression=result[key];
					else expression=LogicAND(expression,result[key]);
				}
				return expression;
			}
		},
		/*
		Returns expression without equivalences and implications
		*/
		getSimpleBasis:function()
		{
			return that;
		},
		getSCNFParts:function()
		{
			var parts=new Array();
			var allVariables=that.getVariables();
			//alert(allVariables.length);
			var variables=new Array();
			for(var key in allVariables)
			{
				variables.push({variable:allVariables[key], value:false});
			}
			var first=true;
			for(var i=variables.length-1; i>=0;)
			{
				if(variables[i].value)
				{	
					variables[i].value=false;
					i--;
				}
				else
				{
					if(first)
					{
						first=false;
					}
					else variables[i].value=true;
					i=variables.length-1;
					var result=that.calculate(variables);
					if(!result)
					{
						var SCNFPart=false;
						for(var key in variables)
						{
							var currentOperand=(variables[key].value) ? LogicNOT(variables[key].variable) : variables[key].variable;
							if(!SCNFPart) SCNFPart=currentOperand;
							else SCNFPart=LogicOR(SCNFPart,currentOperand);
						}
						parts.push(SCNFPart);
					}
				}
			}
			return parts;
		},
		getResult:function()
		{
			var result=new Array();
			var allVariables=that.getVariables();
			var variables=new Array();
			for(var key in allVariables)
			{
				variables.push({variable:allVariables[key], value:false});
			}
			var first=true;
			for(var i=variables.length-1; i>=0;)
			{
				if(variables[i].value)
				{	
					variables[i].value=false;
					i--;
				}
				else
				{
					if(first)
					{
						first=false;
					}
					else variables[i].value=true;
					i=variables.length-1;
					result.push(that.calculate(variables));
				}
			}
			return result;
		},
		makeResolution:function(gExpression)
		{
			var result=that.makeResolutionAdvanced(gExpression);
			if(!result)
			{
				return false;
			}
			else return result.result;
		},
		/*
		Returns object with:
			reason - Operand, which giver the resolution
			result - Resolution
		*/
		makeResolutionAdvanced:function(gExpression)
		{
			var dis1=that.getDisjuncts();
			var dis2=gExpression.getDisjuncts();
			var result=new Array();
			var rFound=false;
			var reason;
			if(dis1 && dis2)
			{
				var flag=false;
				for(var i=0; i<dis1.length && !flag; i++)
				{
					for(var j=0; j<dis2.length && !flag; j++)
					{
						//alert(dis1[i].getMath()+" and "+dis2[j].getMath());
						//alert(":"+i+":"+j);
						if(dis1[i]==dis2[j] || (dis2[j].getType()=="LogicNOT" && dis1[i].getType()=="LogicNOT" && dis1[i].getOperand(1)==dis2[j].getOperand(1)))
						{
							//alert("Found same element: "+dis2[j].getText());
							dis2.splice(j,1);
							j--;
						}
						else if((dis2[j].getType()=="LogicNOT" && dis2[j].getOperand(1)==dis1[i]) || dis1[i].getType()=="LogicNOT" && dis1[i].getOperand(1)==dis2[j])
						{
							//alert("Equal");
							if(rFound)
							{
								result.push(LogicTRUE());
								flag=true;
								break;
							}
							else
							{
								//alert("resolution found: "+dis2[j].getText()+" и "+dis1[i].getText());
								reason=(dis1[i].getType()=="LogicNOT") ? dis2[j] : dis1[i];
								dis2.splice(j,1);
								dis1.splice(i,1);
								i--;
								rFound=true;
								break;
							}
						}
					}
				}
				//alert("Dis1l:"+dis1.length+":"+rFound);
				if(rFound)
				{
					if(result.length==1)
					{
						return result[0];
					}
					else if(dis1.length==0 && dis2.length==0)
					{
						return LogicFALSE();
					}
					else
					{
						result=result.concat(dis1,dis2);
						var resolution=false;
						//alert("RL:"+result.length);
						for(var key in result)
						{
							if(!resolution) resolution=result[key];
							else resolution=LogicOR(resolution,result[key]);
						}
						var returnObject={'reason':reason,'result':resolution};
						return returnObject;
					}
				}
				else return false;
			}
			else return false;
		},
		needBrackets:function()
		{
		
		},
		/*
		Adds object with logical variable into given array
		*/
		_addVariables:function(variables)
		{
		
		},
		/*
		Returns array of simple disjuncts or FALSE, if it's inpossible for this expression
		*/
		getDisjuncts:function()
		{
			var disjuncts=new Array();
			if(that._addDisjuncts(disjuncts))
			return disjuncts;
			else return false;
		},
		/*
		Returns array of simple conjuncts or FALSE, if it's inpossible for this expression
		*/
		getConjuncts:function()
		{
			var conjuncts=new Array();
			if(that._addConjuncts(conjuncts))
			return conjuncts;
			else return false;
		},
		/*
		Add conjuncts of current expression to the array
		*/
		_addConjuncts:function(conjuncts)
		{
			conjuncts.push(that);
			return true;
		},
		/*
		Add disjuncts of current expression to the array
		*/
		_addDisjuncts:function(disjuncts)
		{
			disjuncts.push(that);
			return true;
		},
		/*
		Returns merged expression
		*/
		getMerged:function()
		{	
			return that;
		},
		/*
		Returns expression without inner AND-operator (Distribution)
		*/
		getWithoutInnerAND:function()
		{
			return that;
		},
		/*
		Compares this expression with expression, given as argument
		*/
		compare:function(expression)
		{
			return false;
		}
	};
	return that;
}
/*
Defines any logic variable
*/
var LogicVariable=function(_name,_trueDescription,_falseDescription)
{
	var that=LogicExpression();
	var name;
	that.constructor = arguments.callee;
	name=_name;
	that.trueDescription=_trueDescription;
	that.falseDescription=_falseDescription;
	that.compare=function(expression)
	{
		if(expression.getType()=="LogicVariable" && name==expression.getName())
		{
			return true;
		}
		else return false;
	};
	that.calculate=function(variables)
	{
		for(var key in variables)
		{
			if(variables[key].variable==that)
			{
				return variables[key].value;
			}
		}
	}
	that.getType=function(){return "LogicVariable";}
	that.getText=function() {return that.trueDescription;}
	that.getName=function() {return name;}
	that.getMath=that.getName;
	that.needBracket=function() {return false;}
	that._addVariables=function(variables)
	{
		var insertAfter=0;
		for(var key=0; key<variables.length; key++)
		{
			if(variables[key]!=that)
			{
				if(variables[key].getName()<that.getName())
				{
					if(key+1<variables.length)
					{
						if(variables[key+1].getName()>that.getName())
						{
							insertAfter=key;
						}
					}
					else insertAfter=key;
				}
			}
			else
			{
				insertAfter=-1;
				break;
			}
		}
		if(insertAfter>=0)
		{
			variables.splice(insertAfter,0,that);
		}
	};
	return that;
}
/*
Defines logic operator
*/
var LogicOperator=function()
{
	var that=LogicExpression();
	var operand1;
	that.constructor = arguments.callee;
	that.getType=function(){return "LogicOperator";}
	return that;
}
/*
Defines logic constant
*/
var LogicConstant=function()
{
	var that=LogicExpression();
	that.constructor = arguments.callee;
	that.getType=function(){return "LogicConstant";}
	that.needBrackets=function() {return false;}
	return that;
}
/*
Defines FALSE logical constant
*/
var LogicFALSE=function()
{
	var that=LogicOperator();
	that.getType=function(){return "LogicFALSE";}
	that.compare=function(expression)
	{
		if(expression.getType()=="LogicFALSE")
		{
			return true;
		}
		else return false;
	};
	that.calculate=function(variables)
	{
		return false;
	},
	that.getMath=function()
	{
		return "FALSE";
	},
	that.getText=function()
	{
		return "ЛОЖЬ";
	};
	//prototype.valueOf()=function() {return "false2";}
	that.isFalse=true;
	that.constructor = arguments.callee;
	return that;
}
/*
Defines FALSE logical constant
*/
var LogicTRUE=function()
{
	var that=LogicOperator();
	that.getType=function(){return "LogicTRUE";}
	that.compare=function(expression)
	{
		if(expression.getType()=="LogicTRUE")
		{
			return true;
		}
		else return false;
	};
	that.calculate=function(variables)
	{
		return true;
	},
	that.getMath=function()
	{
		return "TRUE";
	},
	that.getText=function()
	{
		return "ИСТИНА";
	};
	that.isTrue=true;
	that.constructor = arguments.callee;
	return that;
}
/*
Defines AND logical operation
*/
var LogicAND=function(_operand1,_operand2)
{
	var that=LogicOperator();
	var operand1=_operand1;
	var operand2=_operand2;
	that.getType=function(){return "LogicAND";}
	that.getWithoutComplexInversion=function()
	{
		var tOperand1=operand1.getWithoutComplexInversion();
		var tOperand2=operand2.getWithoutComplexInversion();
		return LogicAND(tOperand1, tOperand2);
	};
	that.compare=function(expression)
	{
		if(expression.getType()=="LogicAND")
		{
			var conjuncts1=that.getConjuncts();
			var conjuncts2=expression.getConjuncts();
			if(conjuncts1.length==conjuncts2.length)
			{
				for(var conjunct1Key in conjuncts1)
				{
					conjunct1=conjuncts1[conjunct1Key];
					var found=false;
					for(var conjunct2Key in conjuncts2)
					{
						conjunct2=conjuncts2[conjunct2Key];
						if(conjunct1.compare(conjunct2))
						{
							conjuncts2.splice(conjunct2Key,1);
							found=true;
							break;
						}
					}
					if(!found) return false;
				}
				return true;
			}
		}
		return false;
	};
	that.calculate=function(variables)
	{
		return operand1.calculate(variables) && operand2.calculate(variables);
	},
	that.getMath=function()
	{
		var result="";
		if(that.needBrackets) result+="(";
		result+=""+operand1.getMath()+" & "+operand2.getMath()+"";
		if(that.needBrackets) result+=")";
		return result;
	},
	that.getSimpleBasis=function()
	{
		return LogicAND(operand1.getSimpleBasis(),operand2.getSimpleBasis());
	},
	that.getText=function()
	{
		return "("+operand1.getText()+" И "+operand2.getText()+")";
	}
	that._addVariables=function(variables)
	{
		operand1._addVariables(variables);
		operand2._addVariables(variables);
	};
	that.getOperand=function(id)
	{
		if(id==1) return operand1;
		else if(id==2) return operand2;
		else return false;
	};
	that.needBrackets=function()
	{
		return operand1.needBrackets() && operand2.needBrackets();
	};
	that._addConjuncts=function(conjuncts)
	{
		return operand1._addConjuncts(conjuncts) && operand2._addConjuncts(conjuncts);
	};
	that.getMerged=function()
	{	
		//Получаем массив всех конъюнктов (если это вложенное И-выражение)
		var conjuncts=that.getConjuncts();
		var resultConjuncts=new Array();
		//Ищем одинаковые конъюнкты, чтобы оставить лишь один из них
		//Также ищем отрицания одного выражения - это значит, что вся конъюнкция всегда ложна
		for(var conjunctKey in conjuncts)
		{
			var currentConjunct=conjuncts[conjunctKey];
			var alreadyExists=false;
			for(var resultConjunctKey in resultConjuncts)
			{

				//Смотрим отрицание в две стороны
				if(
					(resultConjuncts[resultConjunctKey].conjunct.getType()=="LogicNOT" && resultConjuncts[resultConjunctKey].conjunct.getOperand(1).compare(currentConjunct))
					|| 
					(currentConjunct.getType()=="LogicNOT" && currentConjunct.getOperand(1).compare(resultConjuncts[resultConjunctKey].conjunct))
					)
				{
					//Это пара выражение - отрицание. Заканчиваем работу и выдаём выражение-ложь.
					return LogicFALSE();
				}
				else if(resultConjuncts[resultConjunctKey].conjunct.compare(currentConjunct))
				{
					//Такое же выражение уже есть. Ставим флаг, чтобы его проигнорировать.
					alreadyExists=true;
				}
			}
			
			if(!alreadyExists)
			{
				//Такого конъюнкта ещё не было - добавляем его упрощённую версию (рекурсивно запускаем такую же функцию) и находим все его дизъюнкты
				var mergedConjunct=currentConjunct.getMerged();
				resultConjuncts.push(
					{
						conjunct: mergedConjunct, 
						disjuncts: mergedConjunct.getDisjuncts()
					});
			}
		}
		//Отсортируем массив по возрастанию числа дизъюнктов
		resultConjuncts.sort(
			function(a,b)
			{
				return a.disjuncts.length>b.disjuncts.length;
			});
		//Теперь начинаем поглощение конъюнктов. Отношение не симметрично!
		for(var i=0; i<resultConjuncts.length; i++)
		{
			for(var j=i+1; j<resultConjuncts.length; j++)
			{
				//Ищем число дизъюнктов, по которому произошло пересечение. На этом этапе не может быть одинаковых дизъюнктов, что упрощает задачу.
				var matches=0;
				for(var dis1 in resultConjuncts[i].disjuncts)
				{
					for(var dis2 in resultConjuncts[j].disjuncts)
					{
						console.log(resultConjuncts[i].disjuncts[dis1]);
						if(resultConjuncts[i].disjuncts[dis1].compare(resultConjuncts[j].disjuncts[dis2]))
						{
							matches++;
							break;
						}
					}
				}
				if(matches==resultConjuncts[i].disjuncts.length)
				{
					//Удаляем j-й конъюнкт
					resultConjuncts.splice(j,1);
					j--;
				}
			}
		}
		//Превращаем массив в выражение
		var result=false;
		for(var conjunct in resultConjuncts)
		{
			//Формируем конъюнкт как дизъюнкция дизъюнктов
			var disjuncts=false;
			for(var disjunctKey in resultConjuncts[conjunct].disjuncts)
			{
				if(disjuncts)
				{
					disjuncts=LogicOR(disjuncts,resultConjuncts[conjunct].disjuncts[disjunctKey]);
				}
				else disjuncts=resultConjuncts[conjunct].disjuncts[disjunctKey];
			}
			if(result)
			{
				result=LogicAND(result,disjuncts);
			}
			else result=disjuncts;
		}
		return result;
		
	};
	that.getWithoutInnerAND=function()
	{
		return LogicAND(operand1.getWithoutInnerAND(), operand2.getWithoutInnerAND());
	},
	that.constructor = arguments.callee;
	return that;
}
/*
Defines OR logical operation
*/
var LogicOR=function(_operand1,_operand2)
{
	var that=LogicOperator();
	var operand1=_operand1;
	var operand2=_operand2;
	that.getType=function(){return "LogicOR";}
	that.getWithoutComplexInversion=function()
	{
		var tOperand1=operand1.getWithoutComplexInversion();
		var tOperand2=operand2.getWithoutComplexInversion();
		return LogicOR(tOperand1, tOperand2);
	};

	that.getOperand=function(id)
	{
		if(id==1) return operand1;
		else if(id==2) return operand2;
		else return false;
	};
	that.compare=function(expression)
	{
		if(expression.getType()=="LogicOR")
		{
			var disjuncts1=that.getDisjuncts();
			var disjuncts2=expression.getDisjuncts();
			if(disjuncts1.length==disjuncts2.length)
			{
				for(var disjunct1Key in disjuncts1)
				{
					disjunct1=disjuncts1[disjunct1Key];
					var found=false;
					for(var disjunct2Key in disjuncts2)
					{
						disjunct2=disjuncts2[disjunct2Key];
						if(disjunct1.compare(disjunct2))
						{
							disjuncts2.splice(disjunct2Key,1);
							found=true;
							break;
						}
					}
					if(!found) return false;
				}
				return true;
			}
		}
		return false;
	};
	that.calculate=function(variables)
	{
		return operand1.calculate(variables) || operand2.calculate(variables);
	}
	that.getText=function()
	{
		return "("+operand1.getText()+" ИЛИ "+operand2.getText()+")";
	},
	that.getSimpleBasis=function()
	{
		return LogicOR(operand1.getSimpleBasis(),operand2.getSimpleBasis());
	},
	that.getMath=function()
	{
		var result="";
		if(that.needBrackets) result+="(";
		result+=""+operand1.getMath()+" | "+operand2.getMath()+"";
		if(that.needBrackets) result+=")";
		return result;
	},
	that._addVariables=function(variables)
	{
		operand1._addVariables(variables);
		operand2._addVariables(variables);
	};
	that.needBrackets=function()
	{
		return operand1.needBrackets() && operand2.needBrackets();
	};
	that._addDisjuncts=function(disjuncts)
	{
		return operand1._addDisjuncts(disjuncts) && operand2._addDisjuncts(disjuncts);
	};
	that.getMerged=function()
	{	
		//Получаем массив всех дизъюнктов (если это вложенное ИЛИ-выражение)
		var disjuncts=that.getDisjuncts();
		var resultDisjuncts=new Array();
		//Ищем одинаковые дизъюнкты, чтобы оставить лишь один из них
		//Также ищем отрицания одного выражения - это значит, что вся дизъюнкция всегда ложна
		for(var disjunctKey in disjuncts)
		{
			var currentDisjunct=disjuncts[disjunctKey];
			var alreadyExists=false;
			for(var resultDisjunctKey in resultDisjuncts)
			{

				//Смотрим отрицание в две стороны
				if(
					(resultDisjuncts[resultDisjunctKey].disjunct.getType()=="LogicNOT" && resultDisjuncts[resultDisjunctKey].disjunct.getOperand(1).compare(currentDisjunct))
					|| 
					(currentDisjunct.getType()=="LogicNOT" && currentDisjunct.getOperand(1).compare(resultDisjuncts[resultDisjunctKey].disjunct))
					)
				{
					//Это пара выражение - отрицание. Заканчиваем работу и выдаём выражение-истину.
					return LogicTRUE();
				}
				else if(resultDisjuncts[resultDisjunctKey].disjunct.compare(currentDisjunct))
				{
					//Такое же выражение уже есть. Ставим флаг, чтобы его проигнорировать.
					alreadyExists=true;
				}
			}
			
			if(!alreadyExists)
			{
				//Такого дизъюнкта ещё не было - добавляем его упрощённую версию (рекурсивно запускаем такую же функцию) и находим все его конъюнкты
				var mergedDisjunct=currentDisjunct.getMerged();
				resultDisjuncts.push(
					{
						disjunct: mergedDisjunct, 
						conjuncts: mergedDisjunct.getConjuncts()
					});
			}
		}
		//Отсортируем массив по возрастанию числа конъюнктов
		resultDisjuncts.sort(
			function(a,b)
			{
				return a.conjuncts.length>b.conjuncts.length;
			});
		//Теперь начинаем поглощение дизъюнктов. Отношение не симметрично!
		for(var i=0; i<resultDisjuncts.length; i++)
		{
			for(var j=i+1; j<resultDisjuncts.length; j++)
			{
				//Ищем число конъюнктов, по которому произошло пересечение. На этом этапе не может быть одинаковых конъюнктов, что упрощает задачу.
				var matches=0;
				for(var con1 in resultDisjuncts[i].conjuncts)
				{
					for(var con2 in resultDisjuncts[j].conjuncts)
					{
						if(resultDisjuncts[i].conjuncts[con1].compare(resultDisjuncts[j].conjuncts[con2]))
						{
							matches++;
							break;
						}
					}
				}
				if(matches==resultDisjuncts[i].conjuncts.length)
				{
					//Удаляем j-й дизъюнкт
					resultDisjuncts.splice(j,1);
					j--;
				}
			}
		}
		//Превращаем массив в выражение
		var result=false;
		for(var disjunct in resultDisjuncts)
		{
			//Формируем конъюнкт как конъюнкция конъюнктов
			var conjuncts=false;
			for(var conjunctKey in resultDisjuncts[disjunct].conjuncts)
			{
				if(conjuncts)
				{
					conjuncts=LogicAND(conjuncts,resultDisjuncts[disjunct].conjuncts[conjunctKey]);
				}
				else conjuncts=resultDisjuncts[disjunct].conjuncts[conjunctKey];
			}
			if(result)
			{
				result=LogicOR(result,conjuncts);
			}
			else result=conjuncts;
		}
		return result;
		
	}
	that.getWithoutInnerAND=function()
	{
		var mainAND = false; //AND, который будем раскладывать
		var slave; //Второй операнд, который будем приделывать
		var needWork=false;
		var tOperand1=operand1.getWithoutInnerAND();
		var tOperand2=operand2.getWithoutInnerAND();
		if(tOperand1.getType()=="LogicAND")
		{
			needWork=true;
			mainAND=tOperand1;
			slave=tOperand2;
		}
		else if(tOperand2.getType()=="LogicAND")
		{
			needWork=true;
			mainAND=tOperand2;
			slave=tOperand1;
		}
		
		if(mainAND)
		{
			var nOperand1=LogicOR(mainAND.getOperand(1),slave).getWithoutInnerAND();
			var nOperand2=LogicOR(mainAND.getOperand(2),slave).getWithoutInnerAND();
			
			return LogicAND(nOperand1, nOperand2);
		}
		else return LogicOR(tOperand1,tOperand2);
	},
	that.constructor = arguments.callee;
	return that;
}
/*
Defines NOT logical operation
*/
var LogicNOT=function(_operand)
{
	var that=LogicOperator();
	var operand=_operand;
	if(_operand.getType()=="LogicNOT")
	{
		that=_operand.getOperand(1);
	}
	else
	{
		that.getType=function(){return "LogicNOT";}
		that.calculate=function(variables)
		{
			return !operand.calculate(variables);
		};
		/*
			Id is for compability
		*/
		that.getOperand=function(id)
		{
			if(id==1) return operand;
			else return false;
		};
		that.getWithoutComplexInversion=function()
		{
			if(operand.getType()=="LogicAND")
			{
				var tOperand1=LogicNOT(operand.getOperand(1)).getWithoutComplexInversion();
				var tOperand2=LogicNOT(operand.getOperand(2)).getWithoutComplexInversion();
				return LogicOR(tOperand1, tOperand2);
			}
			else if(operand.getType()=="LogicOR")
			{
				var tOperand1=LogicNOT(operand.getOperand(1)).getWithoutComplexInversion();
				var tOperand2=LogicNOT(operand.getOperand(2)).getWithoutComplexInversion();
				return LogicAND(tOperand1, tOperand2);
			}
			else
			{
				return that;
			}
		};
		that.compare=function(expression)
		{
			if(expression.getType()=="LogicNOT")
			{
				return operand.compare(expression.getOperand(1));
			}
			else return false;
		};
		that.getSimpleBasis=function()
		{
			return LogicNOT(operand.getSimpleBasis());
		};
		that.getText=function()
		{
			if(operand.getType()=="LogicVariable")
			{
				return operand.falseDescription;
			}
			else return "НЕ ("+operand.getText()+")";
		};
		that.needBrackets=function()
		{
			return operand.needBrackets();
		};
		that.getMath=function()
		{
			var result;
			if(that.needBrackets()) result="!("+operand.getMath()+")";
			else result="!"+operand.getMath();
			return result;
		};
		that._addVariables=function(variables)
		{
			operand._addVariables(variables);
		};
		that.getMerged=function()
		{
			return LogicNOT(operand.getMerged());
		};
		that.getWithoutInnerAND=function()
		{
			return LogicNOT(operand.getWithoutInnerAND());
		}
		that.constructor = arguments.callee;
	}
	return that;
}
/*
Defines implication
*/
var LogicImplication=function(_operand1,_operand2)
{
	var that=LogicOperator();
	var operand1=_operand1;
	var operand2=_operand2;
	that.getType=function(){return "LogicImplication";}
	that.calculate=function(variables)
	{
		return !operand1.calculate(variables) || operand2.calculate(variables);
	},
	that.getText=function()
	{
		return "(ЕСЛИ "+operand1.getText()+", ТО "+operand2.getText()+")";
	},
	that.getOperand=function(id)
	{
		if(id==1) return operand1;
		if(id==2) return operand2;
		return false;
	},
	that.getMath=function()
	{
		var result="";
		if(that.needBrackets) result+="(";
		result+=""+operand1.getMath()+" => "+operand2.getMath()+"";
		if(that.needBrackets) result+=")";
		return result;
	},
	that._addVariables=function(variables)
	{
		operand1._addVariables(variables);
		operand2._addVariables(variables);
	};
	that.needBrackets=function()
	{
		return operand1.needBrackets() && operand2.needBrackets();
	};
	that.getSimpleBasis=function()
	{
		return LogicOR(LogicNOT(operand1.getSimpleBasis()),operand2.getSimpleBasis());
	}
	that.constructor = arguments.callee;
	return that;
}
var LogicChain=function(_newExpression,_newChain)
{
	var expression;
	var variables;
	var result;
	var chain=_newChain;
	expression=_newExpression;
	variables=expression.getVariables();
	result=expression.getResult();
	var that=
	{
		success:false,
		makeResolution:function(_operand)
		{
			var resolution=expression.makeResolution(_operand.getExpression());
			if(resolution && !resolution.isTrue)
			{
				var chain1=chain;
				var chain2=_operand.getChain();
				var newArray=chain1.concat(chain2);
				newArray.push({op1:expression, op2:_operand.getExpression()});
				var newChain=LogicChain(resolution,newArray);
				if(resolution.isFinal) newChain.success=true;
				return newChain;
			}
			else return false;
		},
		isEqual:function(_operand)
		{
			var debug=false;
			var opInfo=_operand.getCheckData();
			if(debug) document.write("(Equal"+variables.length+": ");
			if(variables.length==opInfo.variables.length)
			{
				var flag=true;
				for(var i=0; i<variables.length; i++)
				{
					if(debug) document.write("Var "+variables[i].getName()+"="+result[i]+"|"+opInfo.variables[i].getName()+"="+opInfo.result[i]);
					if(variables[i].getName()!=opInfo.variables[i].getName() || result[i]!=opInfo.result[i])
					{
						if(debug) document.write(")");
						return false;
					}/*
					if(result[i]!=opInfo.result[i])
					{
						return false;
					}*/
				}
				/*
				document.write("Success:");
				for(var i=0; i<variables.length; i++)
				{
					document.write("Var "+variables[i].getName()+" and "+opInfo.variables[i].getName()+",");
				}
				document.write(")<br/>");*/
				if(debug) document.write(")");
				return true;
			}
			else 
			{
			if(debug) document.write(")");
			return false;
			}
		},
		getLength:function()
		{
			return chain.length;
		},
		getExpression:function()
		{
			return expression;
		},
		getChain:function()
		{
			return chain;
		},
		getCheckData:function()
		{
			return {variables:variables,result:result};
		}
	};
	return that;
}
/*
Container for LogicExpressions with search function
*/
var ExpressionsContainer=function()
{
	var array=new Array();
	var that=
	{
		push:function(key, value)
		{
			if(!that.find(key))
			{
				array.push({key: key, value: value});
			}
		},
		find:function(findExpression)
		{
			for(var arrayKey in array)
			{
				if(array[arrayKey].key.compare(findExpression))
				{
					return array[arrayKey].value;
				}
			}
			return false;
		}
	};
	return that;
}

var LogicEquivalence=function(_operand1,_operand2)
{
	var that=LogicOperator();
	var operand1=_operand1;
	var operand2=_operand2;
	that.getType=function(){return "LogicEquivalence";}
	that.calculate=function(variables)
	{
		return (!operand1.calculate(variables) || operand2.calculate(variables)) && (operand1.calculate(variables) || !operand2.calculate(variables));
	},
	that.getText=function()
	{
		return "("+operand1.getText()+", тогда и только тогда, когда "+operand2.getText()+")";
	},
	that.getOperand=function(id)
	{
		if(id==1) return operand1;
		if(id==2) return operand2;
		return false;
	},
	that.getMath=function()
	{
		var result="";
		if(that.needBrackets) result+="(";
		result+=""+operand1.getMath()+" <=> "+operand2.getMath()+"";
		if(that.needBrackets) result+=")";
		return result;
	},
	that._addVariables=function(variables)
	{
		operand1._addVariables(variables);
		operand2._addVariables(variables);
	};
	that.needBrackets=function()
	{
		return operand1.needBrackets() && operand2.needBrackets();
	};
	that.getSimpleBasis=function()
	{
		return LogicAND( LogicOR( LogicNOT( operand1.getSimpleBasis()) ,operand2.getSimpleBasis() ),LogicOR( operand1.getSimpleBasis(), LogicNOT(operand2.getSimpleBasis()) ))

	}
	that.constructor = arguments.callee;
	return that;
}