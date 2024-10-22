'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2024-09-15T10:51:36.790Z',
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

const accounts = [account1, account2];

/////////////////////////////////////////////////
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
// Functions


let currAcc
let recAcc
let timer
const startTimeOut=function(){
  let time=100
  const tick=function(){
    const min=String(Math.trunc(time/60))
    const  sec=String(time%60)
    console.log('hello')
    labelTimer.textContent=`${min.padStart(2,0)}:${sec.padStart(2,0)}`
    if (time===0){
      clearInterval(time)
      labelWelcome.textContent=`Log in to get Started`;
      containerApp.style.opacity=0;
    } 
    time--  
  }
  tick();
  const timer=setInterval(tick,1000)
  return timer
}
const  createUserName=function(accs){
  accs.forEach(function(acc){
    acc.username=acc.owner.toLowerCase().split(' ').map(name=>name[0]).join('')
  })
}
createUserName(accounts);
const formatMovementDate=function(now){
  const passedDays=((date1,date2)=> Math.round((date2-date1)/(1000*60*60*24)))
  const noOfPassedDays=passedDays(now,new Date());
  if(noOfPassedDays==1) return 'Today'
  if(noOfPassedDays==2) return 'Yesterday'
  if(noOfPassedDays<=7) return `${noOfPassedDays} days`
  const day=`${now.getDate()}`.padStart(2,0);
  const month=`${now.getMonth()+1}`.padStart(2,0);
  const year=now.getFullYear();
  return `${day}/${month}/${year}`;
};
//console.log(accounts);
const displayMovements=function(acc,sorted=false){
  const movs= sorted ? acc.movements.slice().sort((a,b)=> a-b) : acc.movements
  containerMovements.innerHTML=''
  const option={
    // hour: 'numeric',
    // minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  }
  movs.forEach(function(value,i){
    const type=value>0? 'deposit': 'withdrawal';
    const now=new Date(acc.movementsDates[i]);
    const displayDate=new Intl.DateTimeFormat(currAcc.locale,option).format(now);
    console.log(displayDate);
    value.toFixed(2);
    const option2={
      style:'currency',
      currency: currAcc.currency
    };
    const  newValue=new Intl.NumberFormat(currAcc.locale,option2).format(value);
    const html=`
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${newValue}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin',html);
  });
}
//displayMovements(account1.movements);

const displaySummaryBalance=function(account){
  const dumdeposit=account.movements.filter(mov=>mov>0).reduce((acc,mov)=>acc+mov,0).toFixed(2);
  const dumwithdraw=account.movements.filter(mov=>mov<0).reduce((acc,mov)=>acc+mov,0).toFixed(2);
  const duminter=account.movements.filter(mov=>mov>0).map(deposit=>deposit*account.interestRate/100).reduce((acc,mov)=>acc+mov,0).toFixed(2);
  const option={
    style: 'currency',
    currency: account.currency
  }
  const deposit=new Intl.NumberFormat(account.locale,option).format(dumdeposit)
  labelSumIn.textContent=`${deposit}`;
  const withdraw=new Intl.NumberFormat(account.locale,option).format(dumwithdraw)
  labelSumOut.textContent=`${withdraw}`;
  const interest=new Intl.NumberFormat(account.locale,option).format(duminter)
  labelSumInterest.textContent=`${interest}`;
  //console.log(deposit,withdraw,inter);
}
//displaySummaryBalance(account1.movements);
const displayFullBalance=function(acc){
  acc.balance=acc.movements.reduce(function(acc,val){
    return acc+val
  },0)
  const option2={
    style:'currency',
    currency: currAcc.currency
  };
  const  formatFullBalance=new Intl.NumberFormat(acc.locale,option2).format(acc.balance)
  labelBalance.textContent=`${formatFullBalance}`;
}
const updateUI=function(currAcc){
  displayMovements(currAcc);
    displayFullBalance(currAcc);
    displaySummaryBalance(currAcc);
}
btnLogin.addEventListener('click',function(e){
  e.preventDefault()
  currAcc=accounts.find(acc=>acc.username === inputLoginUsername.value)
  if(currAcc?.pin==inputLoginPin.value){
    labelWelcome.textContent=`Welcome back ${currAcc.owner.split(' ')[0]}`;
    containerApp.style.opacity=100;
    inputLoginUsername.value='';
    inputLoginPin.value='';
    // inputLoginUsername.blur();
    inputLoginPin.blur();
    const now=new Date();
    // const day=`${now.getDate()}`.padStart(2,0);
    // const month=`${now.getMonth()+1}`.padStart(2,0);
    // const year=now.getFullYear();
    // const hour=`${now.getHours()}`.padStart(2,0);
    // const min=`${now.getMinutes()}`.padStart(2,0);
    if (timer) clearInterval(timer)
    timer=startTimeOut()
    const option={
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    }
    labelDate.textContent=new Intl.DateTimeFormat(currAcc.locale,option).format(now);
    updateUI(currAcc);
  }
})

btnTransfer.addEventListener('click',function(e){
  e.preventDefault();
  const amount=Number(inputTransferAmount.value)
  recAcc=accounts.find(acc=>acc.username === inputTransferTo.value)
  // console.log(amount,currAcc)
  if (amount>0 && recAcc && amount<=currAcc.balance && currAcc!== recAcc){
    //console.log(`hello`);
    currAcc.movements.push(-amount);
    recAcc.movements.push(amount);
    currAcc.movementsDates.push(new Date().toISOString())
    recAcc.movementsDates.push(new Date().toISOString())
    // console.log(currAcc,recAcc);
    updateUI(currAcc);
    if (timer) clearInterval(timer)
      timer=startTimeOut()
  }
  inputTransferAmount.value='';
  //else console.log(`Invalid USER`);
})

btnClose.addEventListener('click',function(e){
  e.preventDefault();
  if (currAcc.username===inputCloseUsername.value && currAcc.pin==inputClosePin.value){
    const index=accounts.findIndex(acc=>acc.username === currAcc.username)
    //console.log(index);
    accounts.splice(index,1);
    console.log(accounts);
    containerApp.style.opacity=0;
    labelWelcome.textContent=`Log in to get Started`
    if (timer) clearInterval(timer)
    //
  } 
  inputCloseUsername.value='';
  inputClosePin.value='';
})
btnLoan.addEventListener('click',function(e){
  e.preventDefault();
  const amount=Number(inputLoanAmount.value)
  if(amount>0 && currAcc.movements.some(mov=> mov >=amount*0.1)){
    currAcc.movements.push(amount);
    currAcc.movementsDates.push(new Date().toISOString());
    setTimeout(()=>updateUI(currAcc),5000)
    if (timer) clearInterval(timer)
      timer=startTimeOut()
    //updateUI(currAcc);
  }
  inputLoanAmount.value='';
})
let sorted=true;
btnSort.addEventListener('click',function(e){
  e.preventDefault();
  //console.log("hello")
  displayMovements(currAcc,sorted) 
  sorted= !sorted
})
labelBalance.addEventListener('click',function(){
  console.log('hello')
  const createdArray=Array.from(
    document.querySelectorAll('.movements__value'),
    mov=> Number(mov.textContent.replace('€',''))
  );
  console.log(createdArray);
})
// setInterval(()=>{
//   const now=new Date('2019-11-18T13:31:17.178Z');
//   const hours=now.getHours()-1;
//   console.log(hours)
//   const  minutes=now.getMinutes();
//   const seconds=now.getSeconds();
//   const ampm=hours>=12 ? 'PM' : 'AM';
//   const formattedTime= `${hours%12 || 12}:${minutes.toString().padStart(2
//     ,0)}:${seconds.toString().padStart(2,'0')} ${ampm}`;
//   console.log(formattedTime);
// },1000)
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
// console.log(Number.parseInt(' 2px',10));


//console.log(Math.abs(new Date(currAcc.movementsDates[0])-new Date())/(1000*60*60*24));
// console.log((new Date()-new Date())/(1000*60*60*24));
// console.log(new Date());