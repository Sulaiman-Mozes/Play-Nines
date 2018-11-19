import React, { Component } from 'react'
import '../App.css'

const Stars = (props) => {
    let stars = []
    for (let i = 0; i < props.numberOfstars; i++) {
        stars.push(<i key={i} className="fa fa-star" aria-hidden="true"></i>)
    }
    return (
        <div className="col-5">
            {stars}
        </div>
    )
}

const Button = (props) => {
    let button;
    switch (props.answerIsCorrect) {
        case true:
            button =
                <button className="btn btn-success"
                    onClick={props.acceptAnswer}>
                    <i className="fa fa-check"></i>{props.redraws}
                </button>
            break;
        case false:
            button =
                <button className="btn btn-danger">
                    <i className="fa fa-times"></i>
                </button>
            break;
        default:
            button =
                <button className="btn btn-primary"
                    onClick={props.checkAnswer}
                    disabled={props.selectedNumbers.length === 0}>
                    =
            </button>
            break;
    }
    return (
        <div className="col-2 text-center">
            {button}
            <br />
            <br />
            <button className="btn btn-warning btn-sm"
                disabled={props.redraws === 0}
                onClick={props.redraw}>
                <i className="fa fa-refresh"></i>{props.redraws}
            </button>
        </div>
    )
}

const Answer = (props) => {
    return (
        <div className="col-5">
            {props.selectedNumbers.map((number, i) =>
                <span key={i}
                    onClick={() => props.unselectNumber(number)}>
                    {number}
                </span>
            )}
        </div>
    );
}

const Numbers = (props) => {
    const arrayOfnumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    const numberClass = (number) => {
        if (props.acceptedNumbers.indexOf(number) >= 0) {
            return "used";
        }
        if (props.selectedNumbers.indexOf(number) >= 0) {
            return "selected";
        }
    }
    return (
        <div className="card text-center ">
            <div>
                {
                    arrayOfnumbers.map((number, i) =>
                        <span key={i} className={numberClass(number)}
                            onClick={() => props.selectNumber(number)}>
                            {number}
                        </span>
                    )
                }

            </div>
        </div>
    )
}

const DoneFrame = (props) => {
    return (
        <div>
            <h3>{props.doneStatus}</h3>
            <button className="btn btn-secondary"
                onClick={props.resetGame}>Play Again</button>
        </div>
    )
}

class Game extends Component {
    static randomNumber = () => (1 + Math.floor(Math.random() * 9));
    static intialState = () => ({
        selectedNumbers: [],
        numberOfstars: Game.randomNumber(),
        answerIsCorrect: null,
        acceptedNumbers: [],
        redraws: 5,
        doneStatus: null,
    })
    state = Game.intialState();
    resetGameState = () => this.setState(Game.intialState());
    selectNumber = (clickedNumber) => {
        if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0) { return; }
        if (this.state.acceptedNumbers.indexOf(clickedNumber) >= 0) { return; }
        this.setState(prevState => ({
            answerIsCorrect: null,
            selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
        }));
    }
    unselectNumber = (clickedNumber) => {
        this.setState(prevState => ({
            answerIsCorrect: null,
            selectedNumbers: prevState.selectedNumbers.filter(
                number => number !== clickedNumber)
        }))
    }
    checkAnswer = () => {
        this.setState(prevState => ({
            answerIsCorrect: prevState.numberOfstars ===
                prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
        }))
    }
    possibleCombinationSum = (arr, n) => {
        if (arr.indexOf(n) >= 0) { return true; }
        if (arr[0] > n) { return false; }
        if (arr[arr.length - 1] > n) {
            arr.pop();
            return this.possibleCombinationSum(arr, n);
        }
        const listSize = arr.length, combinationsCount = (1 << listSize)
        for (let i = 1; i < combinationsCount; i++) {
            let combinationSum = 0;
            for (let j = 0; j < listSize; j++) {
                if (i & (1 << j)) { combinationSum += arr[j]; }
            }
            if (n === combinationSum) { return true; }
        }
        return false;
    };

    acceptAnswer = () => {
        this.setState(prevState => ({
            acceptedNumbers: prevState.acceptedNumbers.concat(prevState.selectedNumbers),
            selectedNumbers: [],
            answerIsCorrect: null,
            numberOfstars: Game.randomNumber()
        }), this.updateDoneStaus)
    }
    redraw = () => {
        if (this.state.redraws === 0) { return }
        this.setState(prevState => ({
            selectedNumbers: [],
            answerIsCorrect: null,
            numberOfstars: Game.randomNumber(),
            redraws: prevState.redraws - 1
        }), this.updateDoneStaus)
    }
    possibleSolutions = ({ acceptedNumbers, numberOfstars }) => {
        const arrayOfnumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
        const possibleNumbers = arrayOfnumbers.filter(number =>
            acceptedNumbers.indexOf(number) === -1);
        return this.possibleCombinationSum(possibleNumbers, numberOfstars)

    }
    updateDoneStaus = () => {
        this.setState(prevState => {
            if (prevState.acceptedNumbers.length === 9) {
                return { doneStatus: "Game Over, You win" }
            }
            if (prevState.redraws === 0 && !this.possibleSolutions(prevState)) {
                return { doneStatus: "Game Over, You loose" }
            }
        });
    }
    render() {
        const { selectedNumbers, numberOfstars, redraws, doneStatus,
            answerIsCorrect, acceptedNumbers } = this.state
        return (
            <div className="container ">
                <h3>Play Nines</h3>
                <hr />
                <div className="row">
                    <Stars numberOfstars={numberOfstars} />
                    <Button selectedNumbers={selectedNumbers}
                        answerIsCorrect={answerIsCorrect}
                        checkAnswer={this.checkAnswer}
                        acceptAnswer={this.acceptAnswer}
                        redraw={this.redraw}
                        redraws={redraws} />
                    <Answer selectedNumbers={selectedNumbers}
                        unselectNumber={this.unselectNumber} />
                </div>
                <br />
                {doneStatus ?
                    <DoneFrame doneStatus={doneStatus}
                        resetGame={this.resetGameState} /> :
                    <Numbers selectedNumbers={selectedNumbers}
                        acceptedNumbers={acceptedNumbers}
                        selectNumber={this.selectNumber}
                    />
                }
            </div>
        );
    }

}
export default Game
