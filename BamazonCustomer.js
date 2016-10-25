// NPM REQUIRED //

var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazon_db"
})

// ITEMS for SALE //

function start(){
connection.query('SELECT * FROM products', function(err, res){
	if(err) throw err;
	console.log('Start Shopping at Bamazon')
	console.log('')

	for(var i = 0; i<res.length;i++){
	console.log("ID: "+ res[i].ItemID + " | " + "Product: " + res[i].ProductName + " | " + "Department: " + res[i].DepartmentName + " | " + "Price: " +res[i].Price + " | " + "Quantity: " + res[i].StockQuantity);
	console.log('')
}

// PURCHASE QUESTIONS //

inquirer.prompt([
	{
		type: "input",
		name: "id",
		message: "",
		validate: function(value){
			if(isNaN(value) == false && parseInt(value) <= res.length && parseInt(value) > 0){
				return true;
			} else{
				return false;
			}
		}
	},
	{
	type: "input",
		name: "quantity",
		message: "Amount needed to buy?",
		validate: function(value){
			if(isNaN(value)){
				return false;
			} else{
				return true;	
			}
		}
	}

// BUY OPTIONS //

	]).then(function(ans){
		var buyWhat = (ans.id)-1;
		var buyHowMuch = parseInt(ans.qty);
		var buyTotal = parseFloat(((res[buyWhat].Price)*buyHowMuch).toFixed(2));

// STOCK AVAILABLE //

	if(res[buyWhat].StockQuantity >= buyHowMuch){
		connection.query("?",[
			{StockQuantity: (res[buyWhat].StockQuantity - buyHowMuch)},
			{ItemID: ans.id}
			], function(err, results){
				if(err) throw err;
				console.log("Purchase Complete! Your purchase price is $" + grandTotal.toFixed(2) + ". Items ship soon");
			});

		connection.query("SELECT * FROM Departments", function(err, deptRes){
			if(err) throw err;
			var index;
			for(var i = 0; i < deptRes.length; i++){
				if(deptRes[i].DepartmentName === res[buyWhat].DepartmentName){
					index = i;
				}
			}

// UPDATE SALES //

		connection.query("UPDATE Departments ? ", [
		{TotalSales: deptRes[index].TotalSales + grandTotal},
		{DepartmentName: res[buyWhat].DepartmentName} 
		],	function(err, deptRes){
			if(err) throw err;
			//console.log("Sales Update");
		});
	});

	} else{
		console.log("All sold out, none in stock");
	}	
	reprompt();
	})
})
}

// ANOTHER PURCHASE //

function reprompt(){
	inquirer.prompt([{
		type: "confirm",
		name: "reply",
		message: "Do you have another purchase?",
	}]).then(function(ans){
		if(ans.reply){
			start();
		} else{
			console.log("Later, come on back soon");
		}
	});
}

start();