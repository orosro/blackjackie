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
        self.credit = 1000;
        self.playerScore= 0;
        self.bankerScore= 0;
        self.winStatus = 0;

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
            controlHit.addEventListener('click', function(){
                self.gS = 103;
                self.updateGS();
            })
            controlHold.addEventListener('click', function(){
                self.gS = 102;
                self.isBsF = false;
                self.updateGS();
            })
        }
    }

    self.updateGS = function(){
        var self = this,
            gS = self.gS;

        if(gS==100){                        // Rest Game
            self.resetCards();
            self.setCredits();
            self.updateInterface();
            self.updateStatusTxt();
        }else  if(gS == 101){               // First Round Starts
            self.updateStatusTxt();
            self.updateInterface();
            self.drawCards();
        } else if(gS == 102){               // Bank draws card
            self.bankerCheckScore();
        } else if(gS == 103){               // Player draws card
            self.drawCards();
        }else if(gS == 104){               // Settling
            self.updateStatusTxt();         // Update the status Text
            self.updateCredits();              //update the credits
            self.updateInterface();
        }

    }


    self.resetCards=function(){
        self.activeCards = [];
        self.bankerCards = [];
        self.playerCards = [];
        self.isBsF = true;
        self.winStatus=0;
        document.getElementsByClassName('playerCardsList')[0].innerHTML ='';
        document.getElementsByClassName('bankerCardsList')[0].innerHTML='';
        document.getElementsByClassName('playerScoreHolder')[0].innerHTML ='';
        document.getElementsByClassName('bankerScoreHolder')[0].innerHTML='';
    }


    self.bankerCheckScore = function(){
        var self = this;
        var isBankerFirst = document.getElementsByClassName('isBankerFirst')[0];
        isBankerFirst.setAttribute("style", "background-image:url(\'cards/"+self.bankerCards[0]+".png\')");
        self.calculateCardScore();
        while(self.bankerScore<17 && self.bankerScore<=self.playerScore){
             self.drawCards();
        }
        self.gS = 104;
        self.calculateCardScore();
    }

    self.calculateCardScore = function(){
        var self = this,
            playerScoreHolder = document.getElementsByClassName('playerScoreHolder')[0],
            bankerScoreHolder = document.getElementsByClassName('bankerScoreHolder')[0],
            pAces = 0,
            bAces = 0,
            cVal;

            self.playerScore = 0;
            self.bankerScore = 0;


            for(var i = 0; i<self.playerCards.length; i++){     // iterate through the cards list
                cVal = self.playerCards[i]%100;                 // module of the card value
                cVal = (cVal>11)?10: cVal;                      // Check if J,Q,K => val = 10
                if(cVal==11) {pAces++};                          // if cVal is A, count it
                self.playerScore += cVal;
                if(self.playerScore>21){
                    while(pAces>0 && self.playerScore>21){
                        self.playerScore -= 10;
                        pAces--;
                    }
                    if(self.playerScore>21){
                        self.gS = 104;                  // Settling status
                        self.winStatus = 6;             // Player is Busted
                        self.updateGS();
                    }
                } else if(self.playerScore==21){
                    self.gS = 104;                  // Settling status
                    self.winStatus = 4;             // Player has BlackJackie
                    self.updateGS();
                }
            };

            for(var i = 0; i<self.bankerCards.length; i++){     // iterate through the cards list
                cVal = self.bankerCards[i]%100;                 // module of the card value
                cVal = (cVal>11)?10: cVal;                      // Check if J,Q,K => val = 10
                if(cVal==11) {bAces++};                          // if cVal is A, count it
                if(self.isBsF && i==0){                         // first val is 0 if round 1
                   cVal=0;
                }
                self.bankerScore += cVal;                       // Calculate score

                if(self.bankerScore>21){
                    while(bAces>0 && self.bankerScore>21){
                        self.bankerScore -= 10;
                        bAces--;
                    }
                    if(self.bankerScore>21){
                        self.gS = 104;                  // Settling status
                        self.winStatus = 7;             // Banker is Busted
                        self.updateGS();
                    }
                } else if(self.bankerScore==21){
                    self.gS = 104;                  // Settling status
                    self.winStatus = 5;             // Player has BlackJackie
                    self.updateGS();
                }
            };
            if(self.gS==104 && self.winStatus==0){
                if(self.playerScore>self.bankerScore){
                    self.winStatus = 1;             // PLAYER WINS
                } else if (self.playerScore<self.bankerScore) {
                    self.winStatus = 2;             // BANKER WINS
                } else if (self.playerScore==self.bankerScore){
                    self.winStatus = 3;             // TIE
                }
                self.updateGS();
            }

            playerScoreHolder.innerHTML = self.playerScore;
            bankerScoreHolder.innerHTML = self.bankerScore;
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



        if(self.gS==104){
            scoreInfo.classList.add('inactive');
            controlBet.classList.add('inactive');
            controlHit.classList.add('inactive');
            controlHold.classList.add('inactive');
            setTimeout(function(){
                self.gS = 100;
                self.updateGS();
            },1500);
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
        } else if (sts == 104){
            if(self.winStatus == 1){
                statusTxt.innerHTML = 'Player wins. GG!';
            } else if(self.winStatus == 2){
                statusTxt.innerHTML = 'Bank wins. :(';
            } else if (self.winStatus == 3) {
                statusTxt.innerHTML = 'TIE';
            } else if(self.winStatus == 4){
                statusTxt.innerHTML = 'Player has BlackJackie!!!';
            } else if(self.winStatus == 5){
                statusTxt.innerHTML = 'Banker has BlackJackie!!!';
            } else if(self.winStatus == 6){
                statusTxt.innerHTML = 'Player is Busted. Bank Wins.';
            } else if(self.winStatus == 7){
                statusTxt.innerHTML = 'Bank is Busted. Player Wins.';
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
        if(self.activeCards.indexOf(self.cards[card])!=-1){
            return self.getCard();
        } else {
            self.activeCards.push(self.cards[card]);
            return self.cards[card];
        }
    }

   self.drawCards = function(){
    var self = this,c,
        playerHolder = document.getElementsByClassName('playerCardsList')[0],
        bankerHolder = document.getElementsByClassName('bankerCardsList')[0];

        if(self.gS==101){                           // First Round
            for(var pc=0;self.playerCards.length <2;pc++){
                c = self.getCard();
                self.playerCards.push(c);
                playerHolder.innerHTML += '<li class="card cardBack" data-card="'+pc+1+'" data-value="'+c+'" style="background-image:url(\'cards/'+c+'.png\')">';
            }

            for(var bc=0;self.bankerCards.length <2;bc++){
                c = self.getCard();
                self.bankerCards.push(c);
                if(bc==0){
                    bankerHolder.innerHTML += '<li class="card cardBack isBankerFirst" data-card="'+bc+1+'"></li>';
                }else{
                    bankerHolder.innerHTML += '<li class="card cardBack" data-card="'+bc+1+'" data-value="'+c+'" style="background-image:url(\'cards/'+c+'.png\')"></li>';
                }

            }
        } else if (self.gS==102){                  // Banker Draws
            c = self.getCard();
            self.bankerCards.push(c);
            bankerHolder.innerHTML += '<li class="card cardBack active" data-value="'+c+'" style="background-image:url(\'cards/'+c+'.png\')">';
        } else if (self.gS==103) {
                c = self.getCard();
                self.playerCards.push(c);
                playerHolder.innerHTML += '<li class="card cardBack active" data-value="'+c+'" style="background-image:url(\'cards/'+c+'.png\')">';
        }

        self.calculateCardScore();
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
    self.updateCredits = function(){
        var self = this,
            ws = self.winStatus;
        if([7,4,1].indexOf(ws)!=-1){
            self.credit+=self.bet;
        }else if([2,5,6].indexOf(ws)!=-1){
            self.credit-=self.bet;
        }
    }

    self.setCredits = function(){
        var self = this,
            credit = document.getElementsByClassName('scoreInfoTxt')[0];
            if(self.credit>0){
                credit.innerHTML = self.credit;
            }else {
                var ok = confirm('So long with the fun, right?')
                if(ok==true){
                    location.reload();
                }
            }
    }


}