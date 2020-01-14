'use strict';

//list of cars
//useful for ALL 5 steps
//could be an array of objects that you fetched from api or database
const cars = [{
  'id': 'a9c1b91b-5e3d-4cec-a3cb-ef7eebb4892e',
  'name': 'fiat-500-x',
  'pricePerDay': 36,
  'pricePerKm': 0.10
}, {
  'id': '697a943f-89f5-4a81-914d-ecefaa7784ed',
  'name': 'mercedes-class-a',
  'pricePerDay': 44,
  'pricePerKm': 0.30
}, {
  'id': '4afcc3a2-bbf4-44e8-b739-0179a6cd8b7d',
  'name': 'bmw-x1',
  'pricePerDay': 52,
  'pricePerKm': 0.45
}];

//list of current rentals
//useful for ALL steps
//the time is hour
//The `price` is updated from step 1 and 2
//The `commission` is updated from step 3
//The `options` is useful for step 4
const rentals = [{
  'id': '893a04a3-e447-41fe-beec-9a6bfff6fdb4',
  'driver': {
    'firstName': 'Roman',
    'lastName': 'Frayssinet'
  },
  'carId': 'a9c1b91b-5e3d-4cec-a3cb-ef7eebb4892e',
  'pickupDate': '2020-01-02',
  'returnDate': '2020-01-02',
  'distance': 100,
  'options': {
    'deductibleReduction': false
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'virtuo': 0
  }
}, {
  'id': 'bc16add4-9b1d-416c-b6e8-2d5103cade80',
  'driver': {
    'firstName': 'Redouane',
    'lastName': 'Bougheraba'
  },
  'carId': '697a943f-89f5-4a81-914d-ecefaa7784ed',
  'pickupDate': '2020-01-05',
  'returnDate': '2020-01-09',
  'distance': 300,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'virtuo': 0
  }
}, {
  'id': '8c1789c0-8e6a-48e3-8ee5-a6d4da682f2a',
  'driver': {
    'firstName': 'Fadily',
    'lastName': 'Camara'
  },
  'carId': '4afcc3a2-bbf4-44e8-b739-0179a6cd8b7d',
  'pickupDate': '2019-12-01',
  'returnDate': '2019-12-15',
  'distance': 1000,
  'options': {
    'deductibleReduction': true
  },
  'price': 0,
  'commission': {
    'insurance': 0,
    'treasury': 0,
    'virtuo': 0
  }
}];

//list of actors for payment
//useful from step 5
const actors = [{
  'rentalId': '893a04a3-e447-41fe-beec-9a6bfff6fdb4',
  'payment': [{
    'who': 'driver',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'partner',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'virtuo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'rentalId': 'bc16add4-9b1d-416c-b6e8-2d5103cade80',
  'payment': [{
    'who': 'driver',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'partner',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'virtuo',
    'type': 'credit',
    'amount': 0
  }]
}, {
  'rentalId': '8c1789c0-8e6a-48e3-8ee5-a6d4da682f2a',
  'payment': [{
    'who': 'driver',
    'type': 'debit',
    'amount': 0
  }, {
    'who': 'partner',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'insurance',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'treasury',
    'type': 'credit',
    'amount': 0
  }, {
    'who': 'virtuo',
    'type': 'credit',
    'amount': 0
  }]
}];


console.log(cars);
console.log(rentals);
console.log(actors);

function diffDate(date1, date2)
{
  var pickupDate = new Date(date1);
  var returnDate = new Date(date2);
  var diffDate = (returnDate - pickupDate)/ (24*60*60*1000)+1 ;
  return diffDate;
}
function getPrices(){
rentals.forEach(rental => 
{
  var car = cars.find(car => car.id === rental.carId);
  var price = diffDate(rental.pickupDate,rental.returnDate) * car.pricePerDay + rental.distance * car.pricePerKm;
  rental.price = price;
});}

function discount()
{
  rentals.forEach(rental=>
    {
    var duration = diffDate(rental.pickupDate, rental.returnDate);
    if(duration>10)
    {rental.price *= 0.5;}
    else if(duration>4)
    {rental.price *= 0.7;}
    else if(duration>1)
    {rental.price *= 0.9;}
  });
}

function commission()
{
  rentals.forEach(rental=>
    {
      var commission = rental.price * 0.3;
      rental.commission.insurance = commission*0.5;
      rental.commission.treasury = diffDate(rental.pickupDate, rental.returnDate);
      rental.commission.virtuo = commission - rental.commission.insurance - rental.commission.treasury;
    });
}

function getDeductible(rental)
{
      if(rental.options.deductibleReduction) return 4 * diffDate(rental.pickupDate, rental.returnDate);
      else return 0; 
}

function pay()
{
  actors.forEach(actor=>
    {
      var rental = rentals.find(rental => rental.id == actor.rentalId);
      actor.payment[0].amount = rental.price + getDeductible(rental);
      var commission = rental.commission.insurance + rental.commission.treasury + rental.commission.virtuo;
      actor.payment[1].amount = rental.price - commission;
      actor.payment[2].amount = rental.commission.insurance;
      actor.payment[3].amount = rental.commission.treasury;
      actor.payment[4].amount = rental.commission.virtuo + getDeductible(rental);
    });
}

function addFees(){
  rentals.forEach(rental=>{
    rental.price += getDeductible(rental);
  })
}

getPrices();
discount();
commission();
pay();
addFees();

