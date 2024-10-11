import { circle, point, Point, ray, rectangle, rectangleFromRay, segment } from 'hmi/src/shapePrimitives'
import { steadyState, Timeline } from 'hmi/src/timeline'
import { Bin, BinLayout, CircularBin, RectangularBin } from '../../backend/src/domain/binLayout'
import { map, mapAsSome, none, Option, some, someNotNullish, someValues, toOption, valueOr } from 'hmi/src/utility/optional'
import { pipe } from 'hmi/src/utility/pipe'
import { circleGraphic, GraphicPrimitive, RectangleGraphic, rectangleGraphic, rgba } from 'hmi/src/graphicPrimitives'
import { makeExponentialEaseInOut } from 'hmi/src/interpolation'
import { now } from '../utility/time';
import { transition, Transitionable } from 'hmi/src/graphicTimelineCalculations'
import { TWO_PI } from 'hmi/src/utility/number'
import { draw } from 'hmi/src/drawers/htmlCanvas'
import { numberKeys } from 'hmi/src/utility/object'

export type BinLayoutRepresentationState = {
    updatedAt: number
    background: Timeline<RectangleGraphic>
    bins: BinRepresentation[]
}

type BinRepresentation = RectangularBinRepresentation | CircularBinRepresentation;

type RectangularBinRepresentation = {
    type: 'RectangularBinRepresentation'
    centerPoint: Timeline<Point>
    width: Timeline<number>
    height: Timeline<number>
    lineThickness: Timeline<number>
}

type CircularBinRepresentation = {
    type: 'CircularBinRepresentation'
    centerPoint: Timeline<Point>
    radius: Timeline<number>
    lineThickness: Timeline<number>
}

export function drawRepresentation(state: BinLayoutRepresentationState, context: CanvasRenderingContext2D) {
    const at = now();
    [
        ...[backgroundGraphics()],
        ...state
            .bins
            .map(bg => bg.type === 'RectangularBinRepresentation'
                ? rectangularBinGraphics(bg)
                : circularBinGraphics(bg))
    ].forEach(graphics => graphics
        .sort((a, b) => a.zIndex - b.zIndex)
        .forEach(graphic => draw(graphic, context)))
    
    function backgroundGraphics(): GraphicPrimitive[] {
        return transition(state.background, at)
    }   
    function circularBinGraphics(bin: CircularBinRepresentation): GraphicPrimitive[] {
        return pipe(
            some({}),
            transitionMerge(bin.centerPoint, at, centerPoint => ({ centerPoint })),
            transitionMerge(bin.radius, at, radius => ({ radius })),                
            transitionMerge(bin.lineThickness, at, lineThickness => ({ lineThickness })),
            map(({
                centerPoint,
                radius,
                lineThickness
            }) => pipe(
                circle(centerPoint, radius),
                toOption,
                mapAsSome(shape => circleGraphic({
                    lineColor: rgba(255, 255, 255),
                    shape,
                    lineThickness
                }))
            )),
            graphicMaybe => [graphicMaybe],
            someValues
        )
    }
    function rectangularBinGraphics(bin: RectangularBinRepresentation): GraphicPrimitive[] {
        return pipe(
            some({}),
            transitionMerge(bin.centerPoint, at, centerPoint => ({ centerPoint })),
            transitionMerge(bin.width, at, width => ({ width })),
            transitionMerge(bin.height, at, height => ({ height })),
            transitionMerge(bin.lineThickness, at, lineThickness => ({ lineThickness })),
            mapAsSome(({
                centerPoint,
                width,
                height,
                lineThickness
            }) => pipe(
                ray(centerPoint, TWO_PI / 4),
                shape => rectangleFromRay(shape, width, height),
                shape => rectangleGraphic({
                    lineColor: rgba(255, 0, 0),
                    shape,
                    lineThickness
                })
            )),
            graphicMaybe => [graphicMaybe],
            someValues
        )
    }    
}

export function updateRepresentation(layout: BinLayout, maybePrevious: Option<BinLayoutRepresentationState>)
    : BinLayoutRepresentationState {
    const delay = 60;
    const easeInOut = makeExponentialEaseInOut(3);
    const updatedAt = now();
    const delayTo = updatedAt + delay;
    return pipe(
        maybePrevious,
        valueOr<BinLayoutRepresentationState>({
            background: {
                method: easeInOut
            },
            bins: [], 
            updatedAt
        }),
        previous => ({
            background: updateBackground(previous.background),
            bins: updateBins(previous.bins),
            updatedAt
        }))

    function updateBackground(previous: Timeline<RectangleGraphic>): Timeline<RectangleGraphic> {
        return pipe(
            {
                isNew: numberKeys(previous).length === 0,
                graphic: rectangleGraphic({
                    lineColor: layout.background,
                    shape: pipe(
                        layout.dimensions.width / 2,
                        midX => segment(point(midX, 0), point(midX, layout.dimensions.height)),
                        midLine => rectangle(midLine, layout.dimensions.width)),
                    lineThickness: 0,
                    fillColor: layout.background
                })
            },
            ({ isNew, graphic }) => ({
                ...previous,
                ...(isNew ? { [updatedAt]: graphic } : {}),
                [delayTo]: graphic
            })
            
        );
    }

    function updateBins(previousBins: BinRepresentation[]): BinRepresentation[] {
        
        return layout
            .bins
            .reduce((acc, bin, i) => [...acc, updateBin(bin, i)], [] as BinRepresentation[])

        function updateBin(bin: Bin, index: number): BinRepresentation {

            return bin.type === 'RectangularBin'
                ? updateRectangularBin(bin)
                : updateCircularBin(bin)
            
            function updateCircularBin(bin: CircularBin): CircularBinRepresentation {
                return pipe(
                    someNotNullish(previousBins[index]),
                    map(prevBin => prevBin.type === 'CircularBinRepresentation' 
                        ? some(prevBin) 
                        : none<CircularBinRepresentation>()),
                    valueOr(({
                        type: 'CircularBinRepresentation' as const,
                        centerPoint: {
                            method: easeInOut,
                            [updatedAt]: point(0, 0)
                        },
                        radius: {
                            method: easeInOut,
                            [updatedAt]: 0
                        },
                        lineThickness: {
                            method: easeInOut,
                            [updatedAt]: 0
                        }
                    })),
                    previous => ({
                        ...previous,
                        centerPoint: { ...previous.centerPoint, [delayTo]: bin.center },
                        radius: { ...previous.radius, [delayTo]: bin.radius },
                        lineThickness: { ...previous.lineThickness, [delayTo]: layout.lineThickness }
                    })
                )
            }
            function updateRectangularBin(bin: RectangularBin): RectangularBinRepresentation {
                return pipe(
                    someNotNullish(previousBins[index]),
                    map(prevBin => prevBin.type === 'RectangularBinRepresentation' 
                        ? some(prevBin) 
                        : none<RectangularBinRepresentation>()),
                    valueOr(({
                        type: 'RectangularBinRepresentation' as const,
                        centerPoint: {
                            method: easeInOut,
                            [updatedAt]: point(0, 0)
                        },
                        width: {
                            method: easeInOut,
                            [updatedAt]: 0
                        },
                        height: {
                            method: easeInOut,
                            [updatedAt]: 0
                        },
                        lineThickness: {
                            method: easeInOut,
                            [updatedAt]: 0
                        }
                    })),
                    previous => ({
                        ...previous,
                        centerPoint: { ...previous.centerPoint, [delayTo]: bin.center },
                        width: { ...steadyState(previous.width, updatedAt), [delayTo]: bin.dimensions.width },
                        height: { ...steadyState(previous.height, updatedAt), [delayTo]: bin.dimensions.height },
                        lineThickness: { ...previous.lineThickness, [delayTo]: layout.lineThickness }
                    })
                )
            }
        }
        
    }
}

function transitionMerge<T extends Transitionable, U extends Object, V>(         
    timeline: Timeline<T>,
    at: number, 
    someFn: (v: T) => U): (toMerge: Option<V>) => Option<V & U> {
        return toMerge => pipe(
            toMerge,
            map(mergeV => pipe(                
                transition(timeline, at),
                mapAsSome(someFn),
                mapAsSome(newObj => ({ ...mergeV, ...newObj })))))
}