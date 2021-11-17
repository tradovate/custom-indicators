const predef = require("./tools/predef")
const { px, du, op } = require("./tools/graphics")

const Trender = {

    render({anchors, props}) {
        const upperDiff = anchors[2]
            ? anchors[2].y.value - anchors[1].y.value
            : 0
            
        if(anchors[2]) {
            anchors[2].x.value = anchors[0].x.value
        }
        return {
            items: [
                {
                    tag: 'LineSegments',
                    key: 'lower',
                    lines: [
                        {
                            tag: 'Line',
                            a: anchors[0],
                            b: anchors[1]
                        }
                    ],
                    lineStyle: {
                        width: 2,
                        color: props.lower
                    }
                },
                {
                    tag: 'LineSegments',
                    key: 'upper',
                    lines: [
                        {
                            tag: 'Line',
                            a: anchors[2] 
                                ? {
                                    x: anchors[0].x,
                                    y: du(anchors[0].y.value + upperDiff)
                                }
                                : anchors[0],
                            b: anchors[2] 
                                ? {
                                    x: anchors[1].x,
                                    y: anchors[2].y
                                }
                                : anchors[0]
                        }
                    ],
                    lineStyle: {
                        width: 2,
                        color: props.upper
                    }
                },
                {
                    tag: 'LineSegments',
                    key: 'middle',
                    lines: [
                        {
                            tag: 'Line',                            
                            a: anchors[2] 
                                ? {
                                    x: anchors[0].x,
                                    y: du(anchors[0].y.value + upperDiff/2) 
                                }
                                : anchors[0],
                            b: anchors[2] 
                                ? {
                                    x: anchors[1].x,
                                    y: du(anchors[1].y.value + upperDiff/2)
                                }
                                : anchors[0]
                        }
                    ],
                    lineStyle: {
                        width: 2,
                        color: props.middle,
                        lineStyle: 3
                    },
                }
            ]
        }
    },

    tooltips({anchors, props}) {
        const deltaARaw = anchors[1] ? anchors[0].y.value - anchors[1].y.value : 0,
              deltaBRaw = anchors[2] ? anchors[2].y.value - anchors[0].y.value : 0,
              deltaA    = Math.abs(deltaARaw),
              deltaB    = Math.abs(deltaBRaw)
              
        return [
            {
                coord: anchors[0],
                alignment: {
                    tag: 'predef',
                    x: 'center',
                    y: 'below'
                },
                items: [
                    {
                        key: 'a0',
                        content: anchors[0].y.value
                    }
                ]
            },
            {
                coord: anchors[1] || anchors[0],
                alignment: {
                    tag: 'predef',
                    x: 'right',
                    y: 'below'
                },
                items: [
                    //price-point
                    {
                        key: 'a1',
                        content: anchors[1] ? anchors[1].y.value : 0
                    },
                    //tick delta
                    {
                        title: 
                            deltaARaw < 0 ? 'min. A to B Long: '
                        :   deltaARaw > 0 ? 'max. A to B Short: '
                        :                   ' - ',
                        key: 'lowerMin',
                        content: { delta: deltaA }
                    },
                ]
            },
            {
                coord: 
                    anchors[1] 
                    ? {
                        x: anchors[1].x,
                        y: du(anchors[1].y.value + deltaB/2)
                    }
                    : anchors[0],
                alignment: {
                    tag: 'predef',
                    x: 'right',
                    y: 'center'
                },
                items: [
                    {
                        key: 'a2.5',
                        content: anchors[1] ? anchors[1].y.value + deltaB/2 : 0
                    },
                    {
                        title: 
                            deltaARaw < 0 ? 'avg. A to B Long: ~'
                        :   deltaARaw > 0 ? 'avg. A to B Short: ~'
                        :                   ' - ',
                        key: 'mid',
                        content: 
                            deltaARaw > 0 ? { delta: deltaA - deltaB/2 }
                        :   deltaARaw < 0 ? { delta: deltaA + deltaB/2 }
                        :                   { delta: 0 }
                    },
                ]
            },
            {
                coord: 
                    anchors[1] 
                    ? {
                        x: du(anchors[1].x.value),
                        y: du(anchors[1].y.value + deltaB)
                    }
                    : anchors[0],
                alignment: {
                    tag: 'predef',
                    x: 'right',
                    y: 'above'
                },
                items: [
                    //price
                    {
                        key: 'a1.5',
                        content: anchors[1] ? anchors[1].y.value + deltaB : 0
                    },
                    //delta
                    {
                        title: 
                            deltaARaw < 0 ? 'max. A to B Long: '
                        :   deltaARaw > 0 ? 'min. A to B Short: '
                        :                   ' - ',
                        key: 'lowerMax',
                        content: 
                            deltaARaw > 0 ? { delta: deltaA - deltaB }
                        :   deltaARaw < 0 ? { delta: deltaA + deltaB }
                        :                   { delta: 0 }
                    },
                ]
            },
            //top right
            {
                coord: anchors[2] ? { x: anchors[0].x, y: anchors[2].y } : anchors[0],
                alignment: {
                    tag: 'predef',
                    x: 'center',
                    y: 'above'
                },
                items: [
                    {
                        key: 'a2',
                        content: anchors[2] ? anchors[2].y.value : 0
                    }
                ]
            }
        ]
    },
    anchorRestraints({anchors}) {
        return [ {}, {x: 0}, {x: [anchors[1].x.value, anchors[1].x.value] } ]    
    },

    anchorStyles({props}) {
        return [
            { color: props.lower },
            { color: props.lower },
            { color: props.upper }
        ]
    }
}

module.exports = {
    name: "Price Channel",
    description: "Price Channel",
    drawing: Trender,
    params: {
        upper: predef.paramSpecs.color('#2d2'),
        middle: predef.paramSpecs.color('#999'),
        lower: predef.paramSpecs.color('#d22')
    },
    maxN: 3
}