const { op, px, du } = require('./tools/graphics')
const predef = require('./tools/predef')

function MyTracker(magicNumber) {
    function tracker(value) {
        return tracker.push(value)
    }
    
    tracker.push = (value) => {
        let number = value - tracker.state.last
        let result = number >= magicNumber
        tracker.state.last = value
        return [result, number]
    }
    
    tracker.reset = () => {
        tracker.state = {
            last: -1
        }
    }
    
    tracker.reset()
    
    return tracker
}

class SubstantialGain {
    init() {
        this.tracker = MyTracker(this.props.magicNumber)
    }

    map(d) {
        const [shouldDraw, difference] = this.tracker(d.value())
        
        return {
            graphics: shouldDraw && {
                items: [
                     {
                        conditions: {
                            scaleRangeX: { min: 30 }
                        },
                        tag: "Text",
                        key: "bigText",
                        text: `+ ${difference}`,
                        point: {
                            x: op(du(d.index()), '-', px(4)),
                            y: op(du(d.value()), '-', px(84))
                        },
                        style: { fontSize: 20, fontWeight: "bold", fill: "#0bf" },
                        textAlignment: "centerMiddle"
                    },
                    {
                        tag: 'Container',
                        key: 'mediumContainer',
                        conditions: {
                            scaleRangeX: { min: 10 }
                        },
                        children: [
                            {
                                tag: "Text",
                                key: "ex",
                                point: {
                                    x: op(du(d.index()), '-', px(2)),
                                    y: op(du(d.value()), '-', px(58)),
                                },
                                text: "!",
                                style: { fontSize: 18, fontWeight: "bold", fill: "#fff" },
                                textAlignment: "centerMiddle"
                            },
                            {
                                tag: 'Shapes',
                                key: 'circles',
                                primitives: [
                                    {
                                        tag: 'Circle',
                                        radius: 10,
                                        center: {
                                            x: op(du(d.index()), '-', px(2)),
                                            y: op(du(d.value()), '-', px(60))
                                        }
                                    }
                                ],
                                fillStyle: {
                                    color: '#5b5'
                                }
                            }
                        ],
                    },
                    {
                        tag: 'Container',
                        key: 'tinyContainer',
                        conditions: {
                            scaleRangeX: { min: 0, max: 10 },
                        },
                        children: [
                            {
                                tag: 'Dots',
                                key: 'dots',
                                dots: [
                                    { 
                                        point: {
                                            x: du(d.index()), 
                                            y: op(du(d.value()), '-', px(48))
                                        }, 
                                        color: {
                                            r: .25, 
                                            g: .8, 
                                            b: .25
                                        } 
                                    }
                                ],
                                style: {
                                    lineWidth: 6,
                                    color: '#5c5'
                                }
                            },
                        ],
                    },
                ]
            }
        }
    }
}

module.exports = {
    name: "substantialGain",
    description: "SubstantialGain",
    calculator: SubstantialGain,
    params: {
        magicNumber: predef.paramSpecs.number(1.00, 0.25, 0.25)
    },
    tags: ["My Tools"],
}