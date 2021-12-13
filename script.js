let countResponses = 0;
const labels =[];
//    console.log("labels");
//    console.log(labels);

let superSector = {
  "00" : "Total nonfarm",
  "05" :	"Total private",
  "06" :	"Goods-producing",
  "07" :	"Service-providing",
  "08" :	"Private service-providing",
  "10" :	"Mining and logging",
  "20" :	"Construction",
  "30" : "Manufacturing",
  "31" : "Durable Goods",
  "32" :	"Nondurable Goods",
  "40" : 	"Trade, transportation, and utilities",
  "41" :	"Wholesale trade",
  "42" : 	"Retail trade",
  "43" :	"Transportation and warehousing",
  "44" :	"Utilities",
  "50" :	"Information",
  "55" : 	"Financial activities",
  "60" :	"Professional and business services",
  "65" :	"Education and health services",
  "70" :	"Leisure and hospitality",
  "80" :	"Other services",
  "90" :	"Government"

};

// These are colors from chart.js utils
//Add 22 colors 
const CHART_COLORS = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)', 
  lavendar: 'rgb(204, 204, 255)', 
  babyBlue: 'rgb (153, 255, 255)',
  lime: 'rgb(102, 255, 102)',
  pink: 'rgb(255, 196, 196)',
  torquoise: 'rgb(42, 213, 239)',
  sageGreen: 'rgb(110, 208, 106)',
  grassGreen: 'rgb(0, 153, 151)',
  mustardYellow: 'rgb(240, 218, 75)',
  deepBlue: 'rgb(96, 179, 199)',
  coral: 'rgb(255, 150, 111)',
  brightPink: 'rgb(255, 125, 208)',
  darkPurple: 'rgb(101, 15, 69)',
  pastelPurple: 'rgb(202, 145, 181)',
  indigo: 'rgb(153, 171, 219)',
  seagreen: 'rgb(107, 219, 193)',
  darkBlue: 'rgb(97, 159, 206)'

};
//    console.dir(CHART_COLORS);
// add the same colors and then add 0.5 after it 
let CHART_COLORS_array = Object.keys(CHART_COLORS);
const CHART_COLORS_50_Percent = {
  red: 'rgba(255, 99, 132, 0.5)',
  orange: 'rgba(255, 159, 64, 0.5)',
  yellow: 'rgba(255, 205, 86, 0.5)',
  green: 'rgba(75, 192, 192, 0.5)',
  blue: 'rgba(54, 162, 235, 0.5)',
  purple: 'rgba(153, 102, 255, 0.5)',
  grey: 'rgba(201, 203, 207, 0.5)',
  lavendar: 'rgba(204, 204, 255, 0.5)', 
  babyBlue: 'rgba(153, 255, 255, 0.5)',
  lime: 'rgba(102, 255, 102, 0.5)',
  pink: 'rgba(255, 196, 196, 0.5)',
  torquoise: 'rgba(42, 213, 239, 0.5)',
  sageGreen: 'rgba(110, 208, 106, 0.5)',
  grassGreen: 'rgba(0, 153, 151, 0.5)',
  mustardYellow: 'rgba(240, 218, 75, 0.5)',
  deepBlue: 'rgba(96, 179, 199, 0.5)',
  coral: 'rgba(255, 150, 111, 0.5)',
  brightPink: 'rgba(255, 125, 208, 0.5)',
  darkPurple: 'rgba(101, 15, 69, 0.5)',
  pastelPurple: 'rgba(202, 145, 181, 0.5)',
  indigo: 'rgba(153, 171, 219, 0.5)',
  seagreen: 'rgba(107, 219, 193, 0.5)',
  darkBlue: 'rgba(97, 159, 206, 0.5)'
};
//    console.log(CHART_COLORS_50_Percent);
//    end utils

const data = {
  labels: labels,
  datasets: []
};
  //  console.dir(data);

const config = {
  type: 'line',
  data: data,
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Number of Employers in Thousands'
      }
    }
  }
};
//    console.log(config);
function drawChart(){
  const myChart = new Chart(
    document.getElementById('myChart'),
    config);
//    console.dir(myChart);
//    console.log("Ending");
}
function responseReceivedHandler() {
  if (this.status == 200) {
    console.log(this.response);
    let datasetElement = {
      label: 'Super sector name',
      data: [],
      borderColor: CHART_COLORS[CHART_COLORS_array[countResponses]],
      backgroundColor: CHART_COLORS_50_Percent[CHART_COLORS_array[countResponses]],
      hidden: true
    }
    console.log("here");
    console.log(this.response.Results);
    let superSectorID = this.response.Results.series[0].seriesID;
    datasetElement.label = superSector[superSectorID.substring(3,5)];
    let dataArray = this.response.Results.series[0].data;
    for (let i = dataArray.length-1; i>=0; i--){
     if (countResponses == 0){
        labels.push(dataArray[i].periodName + " /" + dataArray[i].year);
      }
      datasetElement.data.push(dataArray[i].value);
    }
    countResponses++;
    data.datasets.push(datasetElement);
    if (countResponses == Object.keys(superSector).length) {
      drawChart()

    }
    console.log(this.response);
  } else {
    console.log ("error");
  }
}

let SuperSectorKeys = Object.keys(superSector); // SuperSectorKeys is an array of all 2 digit codes for superSectors
for (let i = 0; i < SuperSectorKeys.length; i++) {
    let xhr = new XMLHttpRequest();
    xhr.responseType = "json"
    xhr.addEventListener("load", responseReceivedHandler);
    // construct the right query string by adding https through ceu on one string + the SuperSectorKey + everything after 65 to the end. 
    let startquery= "https://api.bls.gov/publicAPI/v2/timeseries/data/CEU";
    let endquery= "00000001?registrationkey=11fea7ea11b04dc5b68e6e35f3e15266";
    xhr.open("GET",startquery+SuperSectorKeys[i]+ endquery);
    xhr.send();
}