     
      // function
      function calculateMoney() {
      
        let fifties = document.getElementById('fifty').value;
        let twenties = document.getElementById('twenty').value;
        let tens = document.getElementById('ten').value;
        let fives = document.getElementById('five').value;
        let ones = document.getElementById('one').value;
        let quarters = document.getElementById('quarter').value;
        let dimes = document.getElementById('dime').value;
        let nickels = document.getElementById('nickel').value;
        let pennies = document.getElementById('penny').value;
        let extra_money = document.getElementById('extra_moneyz').value;
        // default value
        
        // parse the values so they're numbers and not strings
        let extraMoneyValue = parseInt(extra_money) || 0;
        let fiftyValue = parseInt(fifties) || 0;
        let twentyValue = parseInt(twenties) || 0;
        let tenValue = parseInt(tens) || 0;
        let fiveValue = parseInt(fives) || 0;
        let oneValue = parseInt(ones) || 0;
        let quarterValue = parseInt(quarters) || 0;
        let dimeValue = parseInt(dimes) || 0;
        let nickelValue = parseInt(nickels) || 0;
        let pennyValue = parseInt(pennies) || 0;
        // let extraMoney = parseInt()
        // calculate moneyz 
        let totalAmount1 = fiftyValue * 50;
        let totalAmount2 = twentyValue * 20;
        let totalAmount3 = tenValue * 10;
        let totalAmount4 = fiveValue * 5;
        let totalAmount5 = oneValue * 1;
        let totalAmount6 = quarterValue * 0.25;
        let totalAmount7 = dimeValue * 0.1;
        let totalAmount8 = nickelValue * 0.05;
        let totalAmount9 = pennyValue * 0.01;
        //calculate moneyz again
        let totalAmount = totalAmount1 + totalAmount2 + totalAmount3 + totalAmount4 + totalAmount5 + totalAmount6 + totalAmount7 + totalAmount8 + totalAmount9 + extraMoneyValue;
        let roundedToHundredth = Math.round(totalAmount * 100) / 100;
        // console.log(roundedToHundredth);
        
  
      // grab the output1 value
      let out1 = document.getElementById('output1');
  
      // Clear any existing content because without this it would create a million boxes
      out1.textContent = '';
  
      // Create a new element to contain the result
      let resultDiv = document.createElement('div');
      resultDiv.textContent = roundedToHundredth;
  
      // Append the new element to the output container
      out1.appendChild(resultDiv);
  
  
        }
        