//sbse phele we want ki DOM ka sara content load ho jae so that hum uske elements ko access kar ske
document.addEventListener("DOMContentLoaded", function() {
    const searchButton = document.getElementById("search-btn");
    const usernameInput = document.getElementById("user-input");
    const statsContainer = document.querySelector(".stats-container");
    const easyProgressCircle = document.querySelector(".easy-progress");
    const mediumProgressCircle = document.querySelector(".medium-progress");
    const hardProgressCircle = document.querySelector(".hard-progress");
    const easyLabel = document.getElementById("easy-label");
    const mediumLabel = document.getElementById("medium-label");
    const hardLabel = document.getElementById("hard-label");
    const cardStatsContainer = document.querySelector(".stats-card");

    //return true or false based on a regex(regular expression)
    function validateUsername(username) {
        if(username.trim() === "") {// Empty username is invalid
            alert("Username cannot be empty.");
            return false;
         }

        const usernamePattern = /^[a-zA-Z0-9_-]{1,15}$/; // Example pattern: alphanumeric and underscores, 3-20 characters
        const isMatching =  usernamePattern.test(username);
        if(!isMatching) {
            alert("Invalid username format. Please use only letters, numbers, underscores, or hyphens (1-15 characters).");
        }
        return isMatching;
    }
    
    async function fetchUserData(username) {
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try{
            
            searchButton.textContent = 'Searching..';
            searchButton.Disabled = true;

            const response = await fetch(url);
            if(!response.ok){
                throw new Error("Unable to fetch the data");
            }
            const data = await response.json();
            console.log("Fetched data:", data);

            displayUserData(data);
        }
        catch(error){
            console.error("Error fetching data:", error);
            alert("Error fetching data. Please try again later.");
        } finally{
            searchButton.textContent = 'Search';
            searchButton.Disabled = false;
        }
    }

    function UpdateProgressCircle(solved, percentage) {}

    function calculatePercentage(solved, total) {
        if (total === 0) return 0;
        return Math.round((solved / total) * 100);
    }

    function percentageToDegrees(percent) {
        return Math.round((percent / 100) * 360);
    }
    

    function displayUserData(data){

        const {
            easySolved, totalEasy,
            mediumSolved, totalMedium,
            hardSolved, totalHard,
            totalSolved,
            acceptanceRate,
            ranking,
            contributionPoints
        } = data;

        const easyPercent = calculatePercentage(easySolved, totalEasy);
        const mediumPercent = calculatePercentage(mediumSolved, totalMedium);
        const hardPercent = calculatePercentage(hardSolved, totalHard);


        easyProgressCircle.style.setProperty(
            "--progress-degree",
            `${percentageToDegrees(easyPercent)}deg`
        );
        
        mediumProgressCircle.style.setProperty(
            "--progress-degree",
            `${percentageToDegrees(mediumPercent)}deg`
        );
        
        hardProgressCircle.style.setProperty(
            "--progress-degree",
            `${percentageToDegrees(hardPercent)}deg`
        );


        // Update progress circles
        easyProgressCircle.style.setProperty('--progress', easyPercent);
        mediumProgressCircle.style.setProperty('--progress', mediumPercent);
        hardProgressCircle.style.setProperty('--progress', hardPercent);


        // Update labels
        easyLabel.textContent = `${easySolved}/${totalEasy}`;
        mediumLabel.textContent = `${mediumSolved}/${totalMedium}`;
        hardLabel.textContent = `${hardSolved}/${totalHard}`;

        //Update stats cards
        cardStatsContainer.innerHTML = `
        <div class="card">
            <h3>Total Solved</h3>
            <p>${totalSolved}</p>
        </div>

        <div class="card">
            <h3>Acceptance Rate</h3>
            <p>${acceptanceRate}%</p>
        </div>

        <div class="card">
            <h3>Ranking</h3>
            <p>#${ranking}</p>
        </div>

        <div class="card">
            <h3>Contribution Points</h3>
            <p>${contributionPoints}</p>
        </div>
    `;
    }

    searchButton.addEventListener("click", function() {
        const username = usernameInput.value;
        console.log("Fetching data for user:", username);
        if(validateUsername(username)) {
            fetchUserData(username);
        }
    })


})
