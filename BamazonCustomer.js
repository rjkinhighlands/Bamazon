// NPM REQUIRED //

var mysql = require('mysql');
var inquirer = require('inquirer');

// DATABASE CONNECT //

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "",
	database: "bamazon_db"
})

function start(){

// ITEMS for SALE //

connection.query('SELECT * FROM Products', function(err, res){
	if(err) throw err;
	console.log('WELCOME to Shopping at Bobmazon')
	console.log('--------------------------------------------------------------------------------------')

	for(var i = 0; i<res.length;i++){
	console.log("ID: "+ res[i].ItemID + " | " + "Product: " + res[i].ProductName + " | " + "Department: " + res[i].DepartmentName + " | " + "Price: " +res[i].Price + " | " + "Quantity: " + res[i].StockQuantity);
	console.log('--------------------------------------------------------------------------------------')
}

// PURCHASE QUESTIONS //

console.log(' ');
inquirer.prompt([
	  {
		type: "input",
		name: "id",
		message: "Item ID for purchase?",
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
		name: "qty",
		message: "Amount you need to purchase?",
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
	var finalTotal = parseFloat(((res[buyWhat].Price)*buyHowMuch).toFixed(2));

// STOCK AVAILABLE //

	if(res[buyWhat].StockQuantity >= buyHowMuch){
		connection.query("UPDATE Products SET ? WHERE ?", [
			{StockQuantity: (res[buyWhat].StockQuantity - buyHowMuch)},
			{ItemID: ans.id}
			], function(err, result){
				if(err) throw err;
				console.log("Purchase Complete! Your purchase price is $" + finalTotal.toFixed(2) + ". Items ship soon. Thanks for shopping at Bobmazon");
			});

		connection.query("SELECT * FROM Products", function(err, deptRes){
			if(err) throw err;
			var index;
			for(var i = 0; i < deptRes.length; i++){
				if(deptRes[i].DepartmentName === res[buyWhat].DepartmentName){
					index = i;
				}
			}
});
	} else{
	  console.log("BUMMER Bobmazon all sold out, none in stock");
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
			console.log("Later, please come on back to Bobmazon soon");
		}
	});
}

start();