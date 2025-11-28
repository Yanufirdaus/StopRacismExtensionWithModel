// Create a floating button
var floatingButton = document.createElement("button");
var floatingButton2 = document.createElement("button");
var floatingButton3 = document.createElement("button");
var floatingButton4 = document.createElement("button");

floatingButton.style.height = '55px';
floatingButton.style.width = '55px';
floatingButton.style.position = "fixed";
floatingButton.style.bottom = "27%";
floatingButton.style.right = "20px";
floatingButton.style.padding = "10px 15px";
floatingButton.style.backgroundImage = "linear-gradient(to bottom right, #007BFF,rgb(33, 23, 148))";
floatingButton.style.color = "white";
floatingButton.style.border = "3px solid #FFD782";
floatingButton.style.borderRadius = "50%";
floatingButton.style.boxShadow = "0px 4px 6px rgba(0.4, 0.4, 0.5, 0.5)";
floatingButton.style.cursor = "pointer";
floatingButton.style.zIndex = "9999";
floatingButton.style.fontFamily = "'Poppins', sans-serif";
floatingButton.style.fontSize = "12px";
floatingButton.style.fontWeight = "bold";
floatingButton.title = "Tandai Komentar Rasis";

floatingButton2.innerText = "S";
floatingButton2.style.height = '55px';
floatingButton2.style.width = '55px';
floatingButton2.style.position = "fixed";
floatingButton2.style.bottom = "36%";
floatingButton2.style.right = "20px";
floatingButton2.style.padding = "10px 15px";
floatingButton2.style.backgroundImage = "linear-gradient(to bottom right, #007BFF,rgb(33, 23, 148))";
floatingButton2.style.color = "white";
floatingButton2.style.border = "3px solid #FFD782";
floatingButton2.style.borderRadius = "50%";
floatingButton2.style.boxShadow = "0px 4px 6px rgba(0.4, 0.4, 0.5, 0.5)";
floatingButton2.style.cursor = "pointer";
floatingButton2.style.zIndex = "9999";
floatingButton2.style.fontFamily = "'Poppins', sans-serif";
floatingButton2.style.fontSize = "12px";
floatingButton2.style.fontWeight = "bold";
floatingButton2.title = "Sensor Komentar Rasis";

floatingButton3.innerText = "R";
floatingButton3.style.width = '70px';
floatingButton3.style.height = '70px';
floatingButton3.style.borderRadius = '50%';
floatingButton3.style.position = "fixed";
floatingButton3.style.bottom = "15%";
floatingButton3.style.right = "20px";
floatingButton3.style.padding = "10px 15px";
floatingButton3.style.backgroundImage = "linear-gradient(to bottom right, #5D12D2, #FF6AC2)";
floatingButton3.style.color = "white";
floatingButton3.style.border = "4px solid #dfdfdfff";
floatingButton3.style.boxShadow = "0px 4px 4px rgba(0.4, 0.4, 0.5, 0.5)";
floatingButton3.style.cursor = "pointer";
floatingButton3.style.zIndex = "9999";

floatingButton4.style.width = '30px';
floatingButton4.style.height = '30px';
floatingButton4.style.borderRadius = '30%';
floatingButton4.style.position = "fixed";
floatingButton4.style.bottom = "17%";
floatingButton4.style.right = "7%";
floatingButton4.style.padding = "10px 15px";
floatingButton4.style.backgroundImage = "linear-gradient(to bottom right, #5D12D2, #FF6AC2)";
floatingButton4.style.color = "white";
floatingButton4.style.border = "2px solid #FFD782";
floatingButton4.style.boxShadow = "0px 4px 4px rgba(0.4, 0.4, 0.5, 0.5)";
floatingButton4.style.cursor = "pointer";
floatingButton4.style.zIndex = "9999";
floatingButton4.style.fontWeight = "bold";
floatingButton4.style.fontSize = "20px";
floatingButton4.title = "About us";

var scrollDiv = document.querySelector('.x5yr21d.xw2csxc.x1odjw0f.x1n2onr6');

let scrollTimeout;

let activeFeature;


const loadingGif = browser.runtime.getURL("loading.gif");


const logoUrl = browser.runtime.getURL("logo.png");
const markLogo = browser.runtime.getURL("mark.png");
const censorLogo = browser.runtime.getURL("censor.png");
const infoLogo = browser.runtime.getURL("info.png");
floatingButton3.innerHTML = `<img src="${logoUrl}" alt="logo">`;
floatingButton.innerHTML = `<img src="${markLogo}" alt="logo" style="width:24px; height:24px;">`;
floatingButton2.innerHTML = `<img src="${censorLogo}" alt="logo" style="width:32px; height:32px;">`;
floatingButton4.innerHTML = `<img src="${infoLogo}" alt="logo" style="width:24px; height:24px;">`;

const apiUrl = 'https://ddb7b3cd-5000.asse.devtunnels.ms/predict'



function tandaiKomentar() {
    floatingButton.classList.add('button-clicked');

    floatingButton.disabled = true;
    // floatingButton.innerText = "...";
    floatingButton.innerHTML = `<img src="${loadingGif}" alt="logo" style="width:32px; height:32px;">`;

    var commentDivs = document.querySelectorAll(
        'div section main div div div div div div div div div div div div div div span, div section main div div div div div div div div div div div div div div img'
    );

    var commentDivs2 = [];

    for (var i = 0; i < commentDivs.length; i++) {
        var div = commentDivs[i];

        if (i > 1) {
            if (commentDivs[i].tagName === 'SPAN') {
                if (commentDivs[i].textContent.includes('See translation')) {
                    // Skip "See translation"
                } else if (
                    commentDivs[i].textContent.trim().endsWith('h') || 
                    commentDivs[i].textContent.trim().endsWith('w') ||
                    commentDivs[i].textContent == 'Reply' ||
                    commentDivs[i].textContent == 'Like' ||
                    commentDivs[i].textContent === "Paid partnership" ||
                    commentDivs[i].textContent === "" ||
                    commentDivs[i].textContent.includes('likes') ||
                    commentDivs[i].textContent.includes('like') ||
                    /(\d+[dhw])/i.test(commentDivs[i].textContent)
                ) {
                    // Skip elements ending with "h" or "w"
                } else {
                    commentDivs2.push(commentDivs[i]);
                }
            } else {
                commentDivs2.push(commentDivs[i]);
            }
        }
    }

    var commentTexts = [];

    for (var i = 0; i < commentDivs2.length; i++) {
        var div = commentDivs2[i];
        var commentText = div.textContent;

        commentTexts.push(commentText);
    }

    console.log(commentTexts);

    var requestData = {
        texts: commentTexts
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Prediction result:', data);
    
        data.forEach((prediction, index) => {
            var div = commentDivs2[index];
    
            if (prediction.predicted_label === 1) {
                div.style.border = "1px solid red";
                div.style.backgroundColor = "red";
    
                div.style.filter = "";
                div.style.transition = "";
            }
        });
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .finally(() => {
        // Re-enable button and reset text
        floatingButton.disabled = false;
        // floatingButton.innerText = "Tandai Komentar Rasis";
        floatingButton.innerHTML = `<img src="${markLogo}" alt="logo" style="width:24px; height:24px;">`;
        floatingButton.classList.remove('button-clicked');
        activeFeature = 1;
    });
}

function sensorKomentar() {
    floatingButton2.classList.add('button-clicked');

    floatingButton2.disabled = true;
    // floatingButton2.innerText = "...";
    floatingButton2.innerHTML = `<img src="${loadingGif}" alt="logo" style="width:32px; height:32px;">`;

    var commentDivs = document.querySelectorAll(
        'div section main div div div div div div div div div div div div div div span, div section main div div div div div div div div div div div div div div img'
    );

    var commentDivs2 = [];

    for (var i = 0; i < commentDivs.length; i++) {
        var div = commentDivs[i];

        if (i > 1) {
            if (commentDivs[i].tagName === 'SPAN') {
                if (commentDivs[i].textContent.includes('See translation')) {
                    // Skip "See translation"
                } else if (
                    commentDivs[i].textContent.trim().endsWith('h') || 
                    commentDivs[i].textContent.trim().endsWith('w') ||
                    commentDivs[i].textContent == 'Reply' ||
                    commentDivs[i].textContent == 'Like' ||
                    commentDivs[i].textContent === "" ||
                    commentDivs[i].textContent.includes('likes') ||
                    commentDivs[i].textContent.includes('like') ||
                    /(\d+[dhw])/i.test(commentDivs[i].textContent)
                ) {
                    // Skip elements ending with "h" or "w"
                } else {
                    commentDivs2.push(commentDivs[i]);
                }
            } else {
                commentDivs2.push(commentDivs[i]);
            }
        }
    }

    // Initialize an array to hold all the comment texts
    var commentTexts = [];

    // Loop through the commentDivs2 array and collect the text content
    for (var i = 0; i < commentDivs2.length; i++) {
        var div = commentDivs2[i];
        var commentText = div.textContent;

        // Add the comment text to the array
        commentTexts.push(commentText);
    }

    console.log(commentTexts);

    var requestData = {
        texts: commentTexts // Array of collected text content
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData) // Send the payload in the specified format
    })
    .then(response => response.json())
    .then(data => {
        console.log('Prediction result:', data);
    
        // Apply styles based on prediction results
        // Assuming the model returns an array of predictions for each comment
        data.forEach((prediction, index) => {
            var div = commentDivs2[index];
    
            if (prediction.predicted_label === 1) {  // Adjust based on your label
                div.style.border = "";
                div.style.backgroundColor = "";

                div.style.filter = "blur(5px)";
                div.style.transition = "filter 0.3s";
            }
        });
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .finally(() => {
        // Re-enable button and reset text
        floatingButton2.disabled = false;
        // floatingButton2.innerText = "Sensor Komentar Rasis";
        floatingButton2.innerHTML = `<img src="${censorLogo}" alt="logo" style="width:24px; height:24px;">`;
        floatingButton2.classList.remove('button-clicked');
        activeFeature = 2;
    });
}

scrollDiv.addEventListener("scroll", () => {
  clearTimeout(scrollTimeout);

  scrollTimeout = setTimeout(() => {
    // alert(activeFeature);
    if (activeFeature == 1) {
        tandaiKomentar();
    } else if (activeFeature == 2) {
        sensorKomentar();
    } else {

    };
  }, 500); // Adjust timeout as needed
});


// Append the button to the body
// document.body.appendChild(floatingButton);
// document.body.appendChild(floatingButton2);

function isOnPostPage() {
  // Cek apakah URL sesuai pola post/reel
  return /instagram\.com\/(p|reel)\/[^\/]+/.test(window.location.href);
}

function updateButtonVisibility() {
  if (isOnPostPage()) {
    document.body.appendChild(floatingButton3);
  } else {
    floatingButton.remove();  // sembunyikan tombol
    floatingButton2.remove();  // sembunyikan tombol
    floatingButton3.remove();  // sembunyikan tombol
    floatingButton4.remove();  // sembunyikan tombol
  }
}

document.body.appendChild(floatingButton3);
updateButtonVisibility();

// Cek URL setiap beberapa saat (polling)
setInterval(updateButtonVisibility, 500);  // cek 2x per detik



// Add an event listener to the button
floatingButton.addEventListener("click", function () {
    tandaiKomentar();
    
});

floatingButton2.addEventListener("click", function () {
    sensorKomentar();
});

let buttonsVisible = false;

function appendWithSlide(element) {
  // Start clean
  element.classList.remove('visible', 'slide-in');

  document.body.appendChild(element);        // Step 1: Add to DOM
  element.classList.add('slide-in');         // Step 2: Initial (hidden) state

  requestAnimationFrame(() => {
    element.classList.add('visible');        // Step 3: Transition to visible
  });
}

floatingButton3.addEventListener('click', () => {
  floatingButton3.classList.add('button-clicked');

  // Remove class after animation ends so it can be triggered again
  setTimeout(() => {
    floatingButton3.classList.remove('button-clicked');
  }, 300); // match the animation duration
  buttonsVisible = !buttonsVisible;
  if(buttonsVisible == true){
    appendWithSlide(floatingButton)
    appendWithSlide(floatingButton2)
    appendWithSlide(floatingButton4)
    // document.body.appendChild(floatingButton);
    // document.body.appendChild(floatingButton2);
  } else {
    floatingButton.remove();
    floatingButton2.remove();
    floatingButton4.remove();
  }
});

floatingButton4.addEventListener('click', () => {
    window.open('https://ddb7b3cd-3000.asse.devtunnels.ms/', '_blank');
});

