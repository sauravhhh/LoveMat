let currentSection = 1;
const totalSections = 8;
let profileData = {
    loveStyle: '',
    relationshipGoals: [],
    relationshipStyle: [],
    communicationStyle: [],
    socialMedia: '',
    sleepingHabits: '',
    familyPlans: '',
    values: {
        career: 5,
        family: 5,
        relationships: 5,
        health: 5,
        financial: 5
    }
};

// Define which sections allow multiple selections
const multiSelectSections = [2, 3, 4]; // Relationship Goals, Relationship Style, Communication Style

// Initialize option selection
document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', function() {
        const sectionId = this.closest('.card').id;
        const sectionNum = parseInt(sectionId.split('-')[1]);
        const value = this.getAttribute('data-value');
        
        if (multiSelectSections.includes(sectionNum)) {
            // Toggle selection for multi-select sections
            this.classList.toggle('selected');
            
            // Update profile data
            const key = getProfileKey(sectionNum);
            if (this.classList.contains('selected')) {
                if (!profileData[key].includes(value)) {
                    profileData[key].push(value);
                }
            } else {
                profileData[key] = profileData[key].filter(item => item !== value);
            }
        } else {
            // Single selection for other sections
            const parent = this.parentElement;
            parent.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            
            // Save the selected value
            const key = getProfileKey(sectionNum);
            if (key === 'values') {
                // Values section is handled by sliders
                return;
            }
            
            if (Array.isArray(profileData[key])) {
                profileData[key] = [value];
            } else {
                profileData[key] = value;
            }
        }
    });
});

// Helper function to get profile data key from section number
function getProfileKey(sectionNum) {
    const keys = {
        1: 'loveStyle',
        2: 'relationshipGoals',
        3: 'relationshipStyle',
        4: 'communicationStyle',
        5: 'socialMedia',
        6: 'sleepingHabits',
        7: 'familyPlans',
        8: 'values'
    };
    return keys[sectionNum];
}

// Initialize sliders
document.querySelectorAll('.slider').forEach(slider => {
    slider.addEventListener('input', function() {
        const valueSpan = document.getElementById(this.id + '-value');
        valueSpan.textContent = this.value;
        profileData.values[this.id] = parseInt(this.value);
    });
});

function updateProgress() {
    const progress = (currentSection / totalSections) * 100;
    document.getElementById('progress').style.width = progress + '%';
    
    // Update indicators
    for (let i = 1; i <= totalSections; i++) {
        const indicator = document.getElementById(`indicator-${i}`);
        if (i <= currentSection) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    }
    
    // Show/hide back button
    const backBtn = document.getElementById('back-btn');
    if (currentSection > 1) {
        backBtn.style.display = 'flex';
    } else {
        backBtn.style.display = 'none';
    }
    
    // Update next button text for last section
    const nextBtn = document.getElementById('next-btn');
    if (currentSection === totalSections) {
        nextBtn.innerHTML = 'Calculate Compatibility <i class="fas fa-calculator"></i>';
    } else {
        nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
    }
}

function nextSection() {
    // Validate current section
    let isValid = false;
    const key = getProfileKey(currentSection);
    
    if (key === 'values') {
        isValid = true; // Sliders always have default values
    } else if (Array.isArray(profileData[key])) {
        isValid = profileData[key].length > 0;
    } else {
        isValid = profileData[key] !== '';
    }
    
    if (!isValid) {
        // Show a subtle notification instead of alert
        const currentCard = document.getElementById(`section-${currentSection}`);
        currentCard.style.border = '2px solid #ff4b6c';
        setTimeout(() => {
            currentCard.style.border = 'none';
        }, 1000);
        return;
    }
    
    // Hide current section
    document.getElementById(`section-${currentSection}`).style.display = 'none';
    
    if (currentSection < totalSections) {
        // Show next section
        currentSection++;
        document.getElementById(`section-${currentSection}`).style.display = 'block';
        updateProgress();
    } else {
        // Show results
        calculateResults();
    }
}

function previousSection() {
    // Hide current section
    document.getElementById(`section-${currentSection}`).style.display = 'none';
    
    // Show previous section
    currentSection--;
    document.getElementById(`section-${currentSection}`).style.display = 'block';
    updateProgress();
}

function calculateResults() {
    // Hide profile setup and show results
    document.getElementById('profile-setup').style.display = 'none';
    document.getElementById('result-container').style.display = 'block';
    
    // Calculate a compatibility percentage based on selections
    let percentage = 50; // Base percentage
    
    // Adjust based on love style
    if (profileData.loveStyle === 'romantic' || profileData.loveStyle === 'serious') {
        percentage += 10;
    } else if (profileData.loveStyle === 'casual') {
        percentage -= 5;
    }
    
    // Adjust based on relationship goals
    if (profileData.relationshipGoals.includes('long-term') || 
        profileData.relationshipGoals.includes('marriage')) {
        percentage += 8;
    } else if (profileData.relationshipGoals.includes('casual-dating')) {
        percentage -= 3;
    }
    
    // Adjust based on relationship style
    if (profileData.relationshipStyle.includes('monogamous')) {
        percentage += 5;
    }
    
    // Adjust based on communication style
    if (profileData.communicationStyle.includes('direct') || 
        profileData.communicationStyle.includes('assertive')) {
        percentage += 7;
    } else if (profileData.communicationStyle.includes('passive')) {
        percentage -= 2;
    }
    
    // Adjust based on social media
    if (profileData.socialMedia === 'sometimes' || profileData.socialMedia === 'rarely') {
        percentage += 5;
    } else if (profileData.socialMedia === 'very-often') {
        percentage -= 3;
    }
    
    // Adjust based on sleeping habits
    if (profileData.sleepingHabits === 'early-bird') {
        percentage += 3;
    }
    
    // Adjust based on family plans
    if (profileData.familyPlans === 'want-kids-soon' || profileData.familyPlans === 'want-kids-later') {
        percentage += 8;
    } else if (profileData.familyPlans === 'unsure') {
        percentage -= 3;
    }
    
    // Adjust based on values
    const avgValues = (
        profileData.values.career +
        profileData.values.family +
        profileData.values.relationships +
        profileData.values.health +
        profileData.values.financial
    ) / 5;
    
    if (avgValues > 7) {
        percentage += 10;
    } else if (avgValues < 4) {
        percentage -= 5;
    }
    
    // Ensure percentage is between 0 and 100
    percentage = Math.max(0, Math.min(100, Math.round(percentage)));
    
    // Animate the percentage
    animatePercentage(percentage);
    
    // Generate feedback based on selections
    generateFeedback();
}

function animatePercentage(targetPercentage) {
    const percentageElement = document.getElementById('percentage');
    let currentPercentage = 0;
    const increment = targetPercentage / 50;
    
    const timer = setInterval(() => {
        currentPercentage += increment;
        if (currentPercentage >= targetPercentage) {
            currentPercentage = targetPercentage;
            clearInterval(timer);
        }
        percentageElement.textContent = Math.round(currentPercentage) + '%';
    }, 20);
}

function generateFeedback() {
    const feedbackList = document.getElementById('feedback-list');
    const consList = document.getElementById('cons-list');
    
    feedbackList.innerHTML = '';
    consList.innerHTML = '';
    
    // Generate positive feedback
    const positiveFeedback = [];
    
    if (profileData.loveStyle === 'romantic') {
        positiveFeedback.push('Your romantic nature makes you a great partner for meaningful relationships');
    }
    
    if (profileData.relationshipGoals.includes('long-term')) {
        positiveFeedback.push('Your focus on long-term relationships shows commitment and maturity');
    }
    
    if (profileData.relationshipStyle.includes('monogamous')) {
        positiveFeedback.push('Your preference for monogamy aligns with traditional relationship expectations');
    }
    
    if (profileData.communicationStyle.includes('direct')) {
        positiveFeedback.push('Direct communication is key to healthy relationships and you value that');
    }
    
    if (profileData.socialMedia === 'sometimes' || profileData.socialMedia === 'rarely') {
        positiveFeedback.push('Your balanced approach to social media is healthy for relationships');
    }
    
    if (profileData.sleepingHabits === 'early-bird') {
        positiveFeedback.push('Being an early bird often correlates with better health and productivity');
    }
    
    if (profileData.familyPlans === 'want-kids-soon' || profileData.familyPlans === 'want-kids-later') {
        positiveFeedback.push('Having clear family plans helps in finding like-minded partners');
    }
    
    if (profileData.values.relationships >= 7) {
        positiveFeedback.push('Prioritizing relationships shows your commitment to finding a meaningful connection');
    }
    
    if (profileData.values.health >= 7) {
        positiveFeedback.push('Valuing health indicates you take good care of yourself, which is appealing');
    }
    
    // Add default feedback if not enough specific ones
    if (positiveFeedback.length < 3) {
        positiveFeedback.push('Being clear about your preferences helps in finding compatible matches');
        positiveFeedback.push('Your thoughtful approach to relationships will lead to better connections');
    }
    
    // Add feedback to the DOM
    positiveFeedback.forEach(feedback => {
        const item = document.createElement('div');
        item.className = 'feedback-item';
        item.innerHTML = `<i class="fas fa-check-circle"></i> <span>${feedback}</span>`;
        feedbackList.appendChild(item);
    });
    
    // Generate areas to consider
    const cons = [];
    
    if (profileData.loveStyle === 'casual') {
        cons.push('Casual relationships might limit your options if you seek long-term compatibility');
    }
    
    if (profileData.relationshipGoals.includes('casual-dating') && 
        !profileData.relationshipGoals.includes('long-term')) {
        cons.push('Focusing only on casual dating might prevent deeper connections');
    }
    
    if (profileData.relationshipStyle.includes('open') || 
        profileData.relationshipStyle.includes('polyamorous')) {
        cons.push('Non-traditional relationship styles may limit your pool of potential partners');
    }
    
    if (profileData.communicationStyle.includes('passive')) {
        cons.push('Passive communication can lead to misunderstandings in relationships');
    }
    
    if (profileData.socialMedia === 'very-often') {
        cons.push('Heavy social media usage might create unrealistic expectations in relationships');
    }
    
    if (profileData.sleepingHabits === 'night-owl') {
        cons.push('Being a night owl might create scheduling challenges with early bird partners');
    }
    
    if (profileData.familyPlans === 'unsure') {
        cons.push('Being unsure about family plans could create challenges with partners who have clear goals');
    }
    
    if (profileData.values.career >= 8 && profileData.values.relationships < 6) {
        cons.push('Finding balance between career and relationships is important for long-term happiness');
    }
    
    if (profileData.values.financial < 5) {
        cons.push('Financial stability can be an important factor in long-term relationships');
    }
    
    // Add default cons if not enough specific ones
    if (cons.length < 2) {
        cons.push('Consider being more open to different types of people to expand your options');
        cons.push('Reflect on whether your expectations are realistic and flexible');
    }
    
    // Add cons to the DOM
    cons.forEach(con => {
        const item = document.createElement('div');
        item.className = 'cons-item';
        item.innerHTML = `<i class="fas fa-exclamation-circle"></i> <span>${con}</span>`;
        consList.appendChild(item);
    });
}

function downloadResults() {
    // Show loading message
    showToast('Preparing your image...');
    
    // Use html2canvas to capture the result card as an image
    const resultCard = document.getElementById('result-card');
    
    html2canvas(resultCard, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher resolution
        logging: false,
        useCORS: true
    }).then(canvas => {
        // Convert canvas to blob
        canvas.toBlob(function(blob) {
            // Create download link
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `LoveMatch_Results_${new Date().getTime()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Show success message
            showToast('Image downloaded successfully!');
        }, 'image/png');
    }).catch(error => {
        console.error('Error generating image:', error);
        showToast('Error generating image. Please try again.');
    });
}

// Create detailed share text
let shareText = `🎯 LoveMatch Compatibility Results 🎯\n\n`;
shareText += `My Compatibility Score: ${percentage}\n\n`;

shareText += `💡 Strength Insights:\n`;
feedbackItems.slice(0, 3).forEach((item, index) => {
    shareText += `${index + 1}. ${item.replace(/^• /, '')}\n`;
});

shareText += `\n⚠️ Areas to Consider:\n`;
consItems.slice(0, 2).forEach((item, index) => {
    shareText += `${index + 1}. ${item.replace(/^• /, '')}\n`;
});

shareText += `\n🔗 Find your perfect match at LoveMatch!`; // Removed URL from text

if (navigator.share) {
    navigator.share({
        title: 'LoveMatch Compatibility Results',
        text: shareText,
        url: 'https://sauravhhh.github.io/LoveMatch' // Hardcoded URL
    })
    .then(() => {
        showToast('Shared successfully!');
    })
    .catch((error) => {
        // Fallback to clipboard if share fails
        copyToClipboard(shareText + '\n\nhttps://sauravhhh.github.io/LoveMatch');
    });
} else {
    // Fallback to clipboard
    copyToClipboard(shareText + '\n\nhttps://sauravhhh.github.io/LoveMatch');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function restartQuiz() {
    // Reset all data
    currentSection = 1;
    profileData = {
        loveStyle: '',
        relationshipGoals: [],
        relationshipStyle: [],
        communicationStyle: [],
        socialMedia: '',
        sleepingHabits: '',
        familyPlans: '',
        values: {
            career: 5,
            family: 5,
            relationships: 5,
            health: 5,
            financial: 5
        }
    };
    
    // Reset UI
    document.getElementById('result-container').style.display = 'none';
    document.getElementById('profile-setup').style.display = 'block';
    
    // Show first section
    for (let i = 1; i <= totalSections; i++) {
        document.getElementById(`section-${i}`).style.display = i === 1 ? 'block' : 'none';
    }
    
    // Reset selections
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Reset sliders
    document.querySelectorAll('.slider').forEach(slider => {
        slider.value = 5;
        document.getElementById(slider.id + '-value').textContent = '5';
    });
    
    // Reset progress
    updateProgress();
}

// Initialize progress on page load
updateProgress();
