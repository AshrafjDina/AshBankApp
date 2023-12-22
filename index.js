'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE

};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',

};

//const accounts = [account1, account2];

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
//_______________________________________________________________
//MOVEMENTS + add the SORT METHOD 
//Displaying the Movements taking inn the HTML Div elements directly
//A.

const formatMovementDate = function(date, locale) {
    const calcDaysPassed = (date1, date2) => 
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

    const daysPassed = calcDaysPassed(new Date(), date);
    console.log(daysPassed);

    if (daysPassed === 0) return 'Today';
    if (daysPassed === 1) return 'Yesterday';
    if (daysPassed <= 7) return `${daysPassed} days ago`;

    
      // const day = `${date.getDate()}`.padStart(2, 0);
      // const month = `${date.getMonth() + 1}`.padStart(2, 0);
      // const year = date.getFullYear();
      // return `${day}/${month}/${year}`;

      return new Intl.DateTimeFormat(locale).format(date);
    
};

const displayMovements = function (acc, sort = false) {

  //Setting the HTML textContent to be = 0.
  containerMovements.innerHTML = "";

  const movs = sort ? acc.movements.slice().sort((a, b) =>              //The Sort Method. Create Evnt Handler below to call the function.
  a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

  const date = new Date(acc.movementsDates[i]);
  const displayDate = formatMovementDate(date, acc.locale);
  //console.log(displayDate)  
  
  
    //HTML string, 
    const html = 
    `<div class="movements__row">
    <div class="movements__type 
    movements__type--${type}"> ${i + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${mov.toFixed(2)}<\div>
    </div> 
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);

    });
  };
  ///displayMovements(account1.movements);

//_______________________________________________________________

  //B.
  //Displaying the Balance Using the Reduce Payment MethodChangeEvent.
  //REDUCE IS TO BOIL DOWN the ARRAY to one single VALUE

      ///Note Movements changed to Acc for ase of refference

  const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce( (acc, mov) => acc + mov, 0);
  labelBalance.textContent = `R ${acc.balance.toFixed(2)}`;

  };
  ///calcDisplayBalance(account1.movements);

//_______________________________________________________________

//Display SUMMARY of Money-Inn the Account
//THE Magic of CHAIN Method
//C

  const calcDisplaySummary = function (acc) {   //acc is now the intire Acounts.movements in the account
  const incomes = acc.movements
  .filter(mov => mov > 0)
  .reduce( (acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `R${incomes.toFixed(2)}`;

//Display SUMMARY of Money-Out the Account
//C2
  
  const out = acc.movements
  .filter(mov => mov < 0)
  .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `R${Math.abs(out).toFixed(2)}`;

//Display SUMMARY of the ENTEREST charged per Deposit
//C3

  const interest = acc.movements
  .filter(mov => mov > 0)
  .map(deposit => (deposit * acc.interestRate) / 100)
  .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `R${interest.toFixed(2)}`;

  };
  ////calcDisplaySummary(account1.movements);

//_______________________________________________________________

  //re-create the UserName to Initials
  //take the first letter in each iteration

  // const user = "steven Thomas Williams"; //stw

  // const username = user.toLowerCase().split(' ').map (function(name) {
  //  return name [0] ;
  // })
  // .join('')
  // console.log(username);

  //Refectoring The Above Code, with Arrow Function.
  //COLECTING USERNAMES SNF TURN THEM INTO LETERS BY COLECTING ONLY THE 1ST LETERS


  const createUsernames = function (accs) {
    accs.forEach(function (acc) {
      acc.username = acc.owner.toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
    })
  };
  createUsernames(accounts);
  //console.log(accounts)

  //_________________________________
  //D
    //LogInn Button, As event Handler
    //Add PreventDefault method to prevent the buton from reloading/submiting the page
    //On a form, the click event can be achived by just clicking the enter

    //when loging Inn, the find Mentho is used to locate the user name in order to log in


    ///NB. We can call this function everywhere on the code. it will perform th below tasks always
const updateUi = function(acc) {

    //Display Movements
    displayMovements(acc);

    //Display Balance
    calcDisplayBalance(acc);

    //Display Summary
    //removed the ".movements so that the interest can be globally for all the accounts"
    calcDisplaySummary(acc);

}
  //_______________________________
  //Event Handlers

  let currentAccount;

    // FAKE ALWAYS LOGGED IN
    currentAccount = account1;
    updateUi(currentAccount);
    containerApp.style.opacity = 100;

    //EXPERIMENTING API
    // const now = new Date();
    // const options = {
    //   hour: 'numeric',
    //   minute: 'numeric',
    //   day: 'numeric',
    //   month: 'long',
    //   year: 'numeric',
    //   weekday: 'long',
    // };
    // const locale = navigator.language;
    // console.log(locale)

    // labelDate.textContent = new Intl.DateTimeFormat
    // (locale, options).format(now);

    btnLogin.addEventListener('click', function (e) {
      e.preventDefault();

      //FIND METHOD
    currentAccount = accounts.find(
      acc => acc.username === inputLoginUsername.value);

      //console.log(currentAccount);

      if (currentAccount?.pin === Number(inputLoginPin.value)) 
        {
        //Displau UI and Welcome Mesage
          labelWelcome.textContent = `Welcome back, ${
            currentAccount.owner.split(' ')[0]
          }`;
          containerApp.style.opacity = 100;

          

          const now = new Date();
          const options = {
            hour: 'numeric',
            minute: 'numeric',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            weekday: 'long',
          };
          const locale = navigator.language;
          console.log(locale)
      
          labelDate.textContent = new Intl.DateTimeFormat
          (locale, options).format(now);

          //set date outside the Call back function.
          //As you log inn, dates will apear

            // const now = new Date();
            // const day = `${now.getDate()}`.padStart(2, 0);
            // const month = `${now.getMonth() + 1}`.padStart(2, 0);
            // const year = now.getFullYear();
            // const hour = now.getHours();
            // const min = now.getMinutes();
            // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

        //Clear Inputs field once Logged inn including the password
        inputLoginUsername.value = inputLoginPin.value = ''; 
        inputLoginPin.blur();

        updateUi(currentAccount)   //[Re-call the function to update the UI]
        
      }

    });

//_______________________________________________________________
//E
//Event Handlers
  //Implimenting Transfers 
  

  btnTransfer.addEventListener('click', function(e) {
    e.preventDefault();

    //we are looking for the account with the 
    //username that is equal to the the value that is inserted(inputed username)

    const amount = Number(inputTransferAmount.value);
    const receiverAcc = accounts.find(
      acc => acc.username === inputTransferTo.value
    );

    console.log(amount, receiverAcc)
 
    inputTransferAmount.value = inputTransferTo.value = '';

    //before the transfere, the balance needs to be checked first, if it is a positive balance
      if (amount > 0 && 
        receiverAcc &&
        currentAccount.balance >= amount &&
        receiverAcc?.username !== currentAccount.username)
        {
          //console.log('Transfere Valid');
          

          //Implimenting the transfere both both the accounts
          currentAccount.movements.push(-amount);
          receiverAcc.movements.push(amount);

          //Add transfere Date
          currentAccount.movementsDates.push(new Date().
          toISOString());
          receiverAcc.movementsDates.push(new Date().
          toISOString());

          updateUi(currentAccount)   //[Re-call the function to update the UI]
        }

  });

//_______________________________________
//SOME-METHOD
// LOAN REQUEST
//Using SOME & EVERY METHOD
//this method of some works close similor to the includes method. Thye both look insode an array 
//to find values that are matching the requirements. 

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  //Getting the value-amount
const amount = Math.floor(inputLoanAmount.value);
// The Loan can only take place if you have 10% of what you requesting
if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {

    //add the movement
    currentAccount.movements.push(amount);

    //Add Loan Date
    currentAccount.movementsDates.push(new Date().toISOString());

    //Update UI
    updateUi(currentAccount)  //[Re-call the function to update the UI]
  }

  inputLoanAmount.value = '';


})

//_______________________________________
   // THE FINDINDEX METHOD
   //This is a ES6 method it will not work with old browsers


  btnClose.addEventListener('click', function (e) {
    e.preventDefault();

    //console.log('Delete')
    //to check if the user is correct and pin.

    if (
      inputCloseUsername.value === currentAccount.username && 
      Number(inputClosePin.value) === currentAccount.pin
    ) {
      const index = accounts.findIndex(
        acc => acc.username === currentAccount.username
      );
      console.log(index)

      //Deleting the Account
      accounts.splice(index, 1);

      //Hide the UI
      containerApp.style.opacity = 0;

    }

    inputCloseUsername.value = inputClosePin.value = '';

  });
      //For the sort movements to be on a loop everytime it is activated, we need to use the STATE VARIABLE.
      //The VARIABLE needs to be reserved outside the call back function so that is can be preserved so that it can be
      //avtivated everytime we press the button

      let sorted = false;

    btnSort.addEventListener('click', function (e) {
      e.preventDefault();
      displayMovements(currentAccount.movements, !sorted);       //Calling the SORT FUNCTION
      sorted = !sorted;

    });





    //_______________________________________________________________
    //DEPOSITS AND WITHDROWALS
    //Map Filter and Reduce Methods are used for Data Tranformation.

    // const deposits = movements.filter(function (mov) {
    //   return mov > 0;
    // });
    //console.log(movements);
    //console.log(deposits)

    //const withdrowals = movements.filter(mov => mov < 0);
    //console.log(withdrowals)

    //_______________________________________________________________
    //Reduce method used to bring all the numbers in an array 
    //Global Balance of the account, 
    //it also gets a call back function

    // const balance = movements.reduce(function (acc, cur, i, arr) {
    //   console.log(`Iteration ${i}: ${acc}`)
    //   return acc + cur;

    // }, 0);
    // console.log(balance)

    //Maximum Value, using the Reduce method. 
    //Reduce method is the most powerful and most used method but 
    //one must be carful on how to use it witht he Acc(accumulator) and mov Parameters
    /*
    const max = movements.reduce(function (acc, mov) {
      if (acc > mov) return acc;
      else return mov;
    }, movements[0]);

    console.log(max)
    */
    //_______________________________________________________________
    //THE Magic of CHAIN Method (155 udemy) 
    //pipeline to process data
    /*
    const eurToUsd = 1.1;
    const totalDepositsUSD = movements
    .filter(mov => mov > 0)
    .map(mov => mov * eurToUsd)
    .reduce((acc, mov) => acc + mov, 0);

    console.log(totalDepositsUSD)
    */

    //_______________________________________________________________
    //The FIND Method
    //Going to usee the method to find user/ for logging inn. 
    /*
    const account = accounts.find(acc => acc.owner === 'Jessica Davis');
    console.log(account);
    */

    //_______________________________________________________________
      //Day and DATES SetUp
    /*
    const future = new Date(2037, 10, 19, 15, 23);
    console.log(+future);

    const calcDaysPassed = (date1, date2) => 
    Math.abs(date2 - date1) / (1000 * 60 * 60 * 24);

    const days1 = calcDaysPassed(new Date(2037, 3, 4),
    new Date(2037, 3, 14));
    console.log(days1);
    */

    //_______________________________________________________________
    //Internationalizing, A Javascript API that can make an Application to suit different 
    //trings acccording to a particulor country

    
    



  
