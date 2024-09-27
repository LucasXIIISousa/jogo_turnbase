const app = Vue.createApp({
    data() {
        return {
            hero: { life: 100, maxLife: 100, name: "Jubileu", gif: "heroSprite/idle.gif", size: 1.2 },
            villain: { life: 100, maxLife: 100, name: "Craudio", gif: "VillainSprite/idle.gif", size: 1.5 },
            currentTurn: 'hero',
            history: [],
            winner: '',
            rating: null,  
            opinion: '',   
        };
    },
    mounted() {
        this.startBackgroundMusic(); 
    },
    methods: {

        playAgain() {
            this.resetGame();  
        },

        startBackgroundMusic() {
            const music = document.getElementById("background-music");
            music.volume = 0.1;
            const playPromise = music.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log("Música começou a tocar automaticamente.");
                    })
                    .catch((error) => {
                        console.log("Música bloqueada pelo navegador, aguardando interação do usuário.");
                        window.addEventListener('click', () => {
                            music.play();
                        }, { once: true });
                    });
            }
        },
        attack(isHero) {
            const attacker = isHero ? 'hero' : 'villain';
            const defender = isHero ? 'villain' : 'hero';
            this.playAnimation(attacker, 'attack');

            const success = Math.random() > 0.2; 
            if (success) {
                this[defender].life -= 20;
                this.history.push(`${this[attacker].name} attacked ${this[defender].name} - Success!`);
            } else {
                this.history.push(`${this[attacker].name} attacked ${this[defender].name} - Missed!`);
            }

            this.checkGameOver();
            this.switchTurn();
        },
        defense(isHero) {
            const defender = isHero ? 'hero' : 'villain';
            this.playAnimation(defender, 'defend');

            const success = Math.random() > 0.5; 
            this.history.push(`${this[defender].name} defended - ${success ? 'Success' : 'Failed'}`);

            this.switchTurn();
        },
        usePotion(isHero) {
            const user = isHero ? 'hero' : 'villain';
            this.playAnimation(user, 'idle');
            const potionElement = document.createElement('img');
            potionElement.src = './heroSprite/Healpot.png';
            potionElement.classList.add('heal-pot');
            document.querySelector(`.${user}-area`).appendChild(potionElement);
        
            setTimeout(() => {
                document.querySelector(`.${user}-area`).removeChild(potionElement);
            }, 1500); 
        
            this[user].life += 20;  
            if (this[user].life > 100) this[user].life = 100; 
            this.history.push(`${this[user].name} used a potion - Restored 20 HP`);
        
            this.switchTurn();
        },
        
        run(isHero) {
            const runner = isHero ? 'hero' : 'villain';
            this.runStatus = `${this[runner].name} correu da luta!`;  
            this.history.push(`${this[runner].name} tentou fugir - Fuga bem-sucedida!`);
        
            this.showFeedbackScreen('run');
        },
        

        villainAction() {
            const actions = ['attack', 'defense', 'usePotion'];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            this[randomAction](false);
        },

        playAnimation(character, action) {
            const gifPath = `${character === 'hero' ? 'heroSprite' : 'VillainSprite'}/${action}.gif`;
            this[character].gif = gifPath;

            setTimeout(() => {
                this[character].gif = `${character === 'hero' ? 'heroSprite' : 'VillainSprite'}/idle.gif`;
            }, 1000);
        },

        switchTurn() {
            this.currentTurn = this.currentTurn === 'hero' ? 'villain' : 'hero';
            if (this.currentTurn === 'villain') {
                setTimeout(() => {
                    this.villainAction();
                }, 1000);
            }
        },
        checkGameOver() {
            if (this.hero.life <= 0) {
                this.playAnimation('hero', 'Dead');
                setTimeout(() => {
                    this.winner = this.villain.name; 
                    this.showFeedbackScreen(false); 
                }, 1500);
            } else if (this.villain.life <= 0) {
                this.playAnimation('villain', 'Dead');
                setTimeout(() => {
                    this.winner = this.hero.name; 
                    this.showFeedbackScreen(true); 
                }, 1500);
            }
        },
        
        showFeedbackScreen(outcome) {
            const music = document.getElementById("background-music");
            music.pause();  

            let feedbackMessage = '';
        
            if (outcome === 'run') {
                feedbackMessage = this.runStatus;  
            } else if (outcome) {
                feedbackMessage = `${this.winner} derrotou o vilão!`;  
            } else {
                feedbackMessage = `${this.winner} derrotou o herói!`;  
            }
            
            document.querySelector('#feedback-screen h2').textContent = feedbackMessage;
        
            document.getElementById("feedback-screen").style.display = "flex";
        },
        
        
        submitFeedback() {
            console.log(`Nota: ${this.rating}, Opinião: ${this.opinion}`);
            this.rating = null;
            this.opinion = '';
            this.winner = ''; 
            document.getElementById("feedback-screen").style.display = "none"; 
            this.resetGame(); 
        },
        
        playBackgroundMusic() {
            const music = document.getElementById("background-music");
            music.play(); 
        },
        stopBackgroundMusic() {
            const music = document.getElementById("background-music");
            music.pause(); 
            music.currentTime = 0; 
        }
    }
    
});
function reloadPage() {
    location.reload();  
}
app.mount("#app");
