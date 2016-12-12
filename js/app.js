'use strict';
function  initJack(){
    window.jack = new blackJackie();       // Create new black Jackie Game
        window.jack.init();                    // Init black Jackie game
}


/*
*   Creates black jackie game
 */
function blackJackie(){
    var self = this;
    self.init = function(){
        self.black = 21;                // limit for BJ
        self.gS = 100;                  // Game State
        self.bet = 10;
        self.minBet = 10;
        self.maxBet = 100;
        self.cards = [102,103,104,105,106,107,108,109,110,111,112,113,114,202,203,204,205,206,207,208,209,210,211,212,213,214,302,303,304,305,306,307,308,309,310,311,312,313,314,402,403,404,405,406,407,408,409,410,411,412,413,414];
        self.activeCards = [];
        self.bankerCards = [];
        self.playerCards = [];
        self.amount = 1000;
        self.playerScore= 0;
        self.bankerScore= 0;

        addEvents();
        self.updateGS();                //
        self.setBet(0);



        function addEvents(){
            var betI = document.getElementsByClassName('betIncrease')[0],
                betD = document.getElementsByClassName('betDecrease')[0],
                controlBet = document.getElementsByClassName('gameControlsBet')[0],
                controlHit = document.getElementsByClassName('gameControlsHit')[0],
                controlHold = document.getElementsByClassName('gameControlsHold')[0];

            betI.addEventListener('click', function(){
                self.setBet(2);
            })
            betD.addEventListener('click', function(){
                self.setBet(1);
            })



            controlBet.addEventListener('click', function(){
                self.gS = 101;
                self.updateGS();
            })
        }
    }

    self.updateGS = function(){
        var self = this,
            gS = self.gS;
        console.log(gS);

        if(gS==100){
            self.updateInterface();
            self.updateStatusTxt();
            self.setAmount();
        }

        if(gS == 101){
            self.updateInterface();
            self.updateStatusTxt();
            self.drawCards();
            self.calculateCardScore();
        }

        if(gS == 102){
            self.setAmount();
            self.updateStatusTxt();
        }

        if(gS == 103){
            self.updateInterface();
            self.updateStatusTxt();
        }

    }

    self.calculateCardScore = function(){
        var self = this,
            playerScoreHolder = document.getElementsByClassName('playerScoreHolder')[0],
            bankerScoreHolder = document.getElementsByClassName('bankerScoreHolder')[0];

            for(var i = 0; i<self.playerCards.length; i++){
                // self.playerCards[i]
            }

    }

    self.updateInterface = function(){
        var self = this,
            scoreInfo = document.getElementsByClassName('scoreInfo')[0],
            controlBet = document.getElementsByClassName('gameControlsBet')[0],
            controlHit = document.getElementsByClassName('gameControlsHit')[0],
            controlHold = document.getElementsByClassName('gameControlsHold')[0];

        if(self.gS==100){
            scoreInfo.classList.remove('inactive');
            controlBet.classList.remove('inactive');
            controlHit.classList.add('inactive');
            controlHold.classList.add('inactive');
        }

        if(self.gS==101){
            scoreInfo.classList.add('inactive');
            controlBet.classList.add('inactive');
            controlHit.classList.remove('inactive');
            controlHold.classList.remove('inactive');
        }

        if(self.gS==103){
            setTimeout(function(){
                self.gS = 100;
                self.updateGS();
            },3000);
        }
    }

    self.drawCards = function(){
        var self = this,c,
            playerHolder = document.getElementsByClassName('playerCardsList')[0],
            bankerHolder = document.getElementsByClassName('bankerCardsList')[0];

        while(self.playerCards.length <2){
            c = self.getCard();
            self.playerCards.push(c);
            playerHolder.innerHTML += '<li class="card cardBack active" data-card="1" data-value="104" style="background-image:url(\'cards/'+c+'.png\')">';
        }

        while(self.bankerCards.length <2){
            c = self.getCard();
            self.bankerCards.push(c);
            bankerHolder.innerHTML += '<li class="card cardBack active" data-card="1" data-value="104" style="background-image:url(\'cards/'+c+'.png\')">';
        }
    }

    self.updateStatusTxt = function(){
        var self  =this,
            sts = self.gS;

        var statusTxt = document.getElementsByClassName('statusTxt')[0].getElementsByTagName('span')[0];
        if(sts==100){
            statusTxt.innerHTML = 'Please choose your bet and press "Bet"'
        } else if (sts==101){
            statusTxt.innerHTML = 'Hit or Hold?';
        } else if (sts == 103){
            if(self.winStatus = 1){
                statusTxt.innerHTML = 'Player wins. GG!';
            } else if(self.winStatus = 2){
                statusTxt.innerHTML = 'Banker wins. :(';
            } else if (self.winStatus = 3) {
                statusTxt.innerHTML = 'TIE';
            }
        }
    }

    /**
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */
    self.getRandomInt=function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    self.getCard = function(){
        var self =this, card;

        card = self.getRandomInt(0,51);

        if(self.activeCards.indexOf(self.cards[card])==-1){
            self.activeCards.push(self.cards[card]);
            return self.cards[card];
        } else {
                self.getCard();
        }
    }


    /*
    * Handles the bettings system
    */
    self.setBet = function(action){
        var self = this,
            a = action,
            isOk;

        if(a==2){
            increaseBet();
        } else if(a==1) {
            decreaseBet();
        } else if (a==0){
            updateBet();
        }

        function increaseBet(){
            isOk = checkBetLimit();
            if(isOk){
                self.bet += 10;
            }
            updateBet();
        }
        function decreaseBet(){
            isOk = checkBetLimit();
            if(isOk){
                self.bet -= 10;
            }
            updateBet();
        }
        function checkBetLimit(){
            if(a==2){
                return (self.bet < self.maxBet);
            }else if (a==1) {
                return (self.bet > self.minBet);
            }
        }

        function updateBet(){
            var biH = document.getElementsByClassName('betInfo')[0];
            biH.value = self.bet;
        }
    }

    self.setAmount = function(){
        var self = this,
            score = document.getElementsByClassName('scoreInfoTxt')[0];
        score.innerHTML = self.amount;
    }




}