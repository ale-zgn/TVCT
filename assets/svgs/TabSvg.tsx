import * as React from 'react';
import Svg, { Path, G, Circle, Defs, ClipPath, Rect, Ellipse, Pattern, Image } from 'react-native-svg';
import { 
    heightPercentageToDP as hp, 
    widthPercentageToDP as wp
} from 'react-native-responsive-screen';

export const TabHomeIcon = ({color, opacity}: {color: string, opacity: number}) => (
    <Svg
      width={20.332}
      height={20.32}
      viewBox="0 0 20.332 20.32"
    >
      <G opacity={opacity} fill={color}>
        <Path
          data-name="Trac\xE9 32156"
          d="M194.542 319.841a2.542 2.542 0 00-2.542 2.542v5.083h5.083v-5.083a2.542 2.542 0 00-2.541-2.542z"
          transform="translate(0 -.16) translate(-184.375 -306.986)"
        />
        <G data-name="Groupe 20504">
          <Path
            data-name="Trac\xE9 32157"
            d="M14.4 15.4v5.083h3.389a2.542 2.542 0 002.542-2.542v-7.73a1.694 1.694 0 00-.477-1.179l-7.2-7.783a3.389 3.389 0 00-4.787-.189q-.1.091-.189.189L.492 9.029A1.694 1.694 0 000 10.223v7.714a2.542 2.542 0 002.542 2.542H5.93V15.4a4.236 4.236 0 118.472 0z"
            transform="translate(0 -.16) translate(0 .16) translate(0 -.16)"
          />
          <Path
            data-name="Trac\xE9 32158"
            d="M194.542 319.841a2.542 2.542 0 00-2.542 2.542v5.083h5.083v-5.083a2.542 2.542 0 00-2.541-2.542z"
            transform="translate(0 -.16) translate(0 .16) translate(-184.375 -307.146)"
          />
        </G>
      </G>
    </Svg>
)

export const TabPropertyIcon = ({color, opacity}: {color: string, opacity: number}) => (
    <Svg
        width={20}
        height={20}
        viewBox="0 0 18.481 20.159"
    >
    <Path
      d="M37.114 2.766a9.226 9.226 0 00-13.108 12.986l.084.084 3.31 3.054a4.564 4.564 0 006.368.017l3.348-3.094a9.226 9.226 0 000-13.047zm-1.491 8.62a2.1 2.1 0 01-2.1 2.1h-5.868a2.1 2.1 0 01-2.1-2.1V8.558A2.516 2.516 0 0126.64 6.49l2.516-1.745a2.523 2.523 0 012.868 0L34.54 6.49a2.516 2.516 0 011.082 2.067zm-1.678-2.828v2.828a.419.419 0 01-.419.419h-1.258v-1.677a.839.839 0 00-.839-.839h-1.677a.839.839 0 00-.839.839v1.677h-1.258a.419.419 0 01-.419-.419V8.558a.839.839 0 01.361-.689l2.516-1.745a.844.844 0 01.956 0l2.516 1.745a.839.839 0 01.36.689z"
      transform="translate(-21.334 -.033)"
      fill={color}
      opacity={opacity}
    />
  </Svg>
)

export const TabSearchIcon = ({color, opacity}: {color: string, opacity: number}) => (
    <Svg
    width={20.142}
    height={20.012}
    viewBox="0 0 20.142 20.012"
  >
    <Path
      d="M5.876 20.065a3.835 3.835 0 01-.442-.1l-2.408-.755A4.208 4.208 0 010 15.178V5.045a4.2 4.2 0 015.809-3.871l.067.031zM17.359.988l-.018-.006-2.279-.755a4.156 4.156 0 00-.792-.174v18.686l1.724.5a3.358 3.358 0 004.152-3.262V4.941A4.205 4.205 0 0017.359.988zm-4.768-.82s-4.9 1.4-5.036 1.419v18.466c.084-.018 5.036-1.373 5.036-1.373z"
      transform="translate(-.004 -.053)"
      fill={color}
      opacity={opacity}
    />
  </Svg>
)

export const TabDocumentIcon = ({color, opacity}: {color: string, opacity: number}) => (
    <Svg
    width={20.016}
    height={20.012}
    viewBox="0 0 20.016 20.012"
  >
    <G opacity={0.999}>
      <Path
        data-name="Trac\xE9 32159"
        d="M15.843 0H4.169A4.169 4.169 0 000 4.169a2.5 2.5 0 002.5 2.5h15.01a2.476 2.476 0 002.5-2.316A4.173 4.173 0 0015.843 0z"
        fill={color}
        opacity={opacity}
      />
      <Path
        data-name="Trac\xE9 32160"
        d="M18.51 10H1.834a.834.834 0 00-.834.834V17.5a4.174 4.174 0 004.169 4.169h10.006a4.174 4.174 0 004.169-4.169v-6.666A.834.834 0 0018.51 10zm-5.837 4.169h-5a.834.834 0 110-1.668h5a.834.834 0 110 1.668z"
        transform="translate(-.166 -1.662)"
        fill={color}
        opacity={opacity}
      />
    </G>
  </Svg>
)

export const TabServiceIcon = ({color, opacity}: {color: string, opacity: number}) => (
    <Svg
    width={20}
    height={20}
    viewBox="0 0 20 20"
  >
    <G
      data-name="Groupe 20315"
      transform="translate(-352 -82)"
      opacity={opacity}
      fill={color}
    >
      <Rect
        data-name="Rectangle 5418"
        width={4}
        height={4}
        rx={1.2}
        transform="translate(352 82)"
      />
      <Rect
        data-name="Rectangle 5423"
        width={4}
        height={4}
        rx={1.2}
        transform="translate(352 90)"
      />
      <Rect
        data-name="Rectangle 5426"
        width={4}
        height={4}
        rx={1.2}
        transform="translate(352 98)"
      />
      <Rect
        data-name="Rectangle 5419"
        width={4}
        height={4}
        rx={1.2}
        transform="translate(360 82)"
      />
      <Rect
        data-name="Rectangle 5422"
        width={4}
        height={4}
        rx={1.2}
        transform="translate(360 90)"
      />
      <Rect
        data-name="Rectangle 5425"
        width={4}
        height={4}
        rx={1.2}
        transform="translate(360 98)"
      />
      <Rect
        data-name="Rectangle 5420"
        width={4}
        height={4}
        rx={1.2}
        transform="translate(368 82)"
      />
      <Rect
        data-name="Rectangle 5421"
        width={4}
        height={4}
        rx={1.2}
        transform="translate(368 90)"
      />
      <Rect
        data-name="Rectangle 5424"
        width={4}
        height={4}
        rx={1.2}
        transform="translate(368 98)"
      />
    </G>
  </Svg>
)

export const TabNewsIcon = ({color, opacity}: {color: string, opacity: number}) => (
  <Svg
    width={21.831}
    height={20.011}
  >
    <Path
      fill={color}
      d="M20.193 1.058a4.548 4.548 0 0 0-3.781-.972l-1.6.393a3.638 3.638 0 0 0-2.983 3.579v14.069a6.284 6.284 0 0 1-1.819 0V4.058A3.621 3.621 0 0 0 7.071.489l-1.7-.415A4.548 4.548 0 0 0 0 4.548v9.817a4.548 4.548 0 0 0 3.734 4.475l5.718 1.04a8.187 8.187 0 0 0 2.927 0l5.721-1.04a4.548 4.548 0 0 0 3.729-4.474V4.548a4.533 4.533 0 0 0-1.637-3.49Z"
      opacity={opacity}
    />
  </Svg>
)

export const TabInquiriesIcon = ({color, opacity}: {color: string, opacity: number}) => (
  <Svg
  width={20.012}
  height={20.012}
  viewBox="0 0 16 16"
>
  <G fill={color} opacity={opacity}>
    <Path
      d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"
      data-name="Trac\xE9 37911"
    />
   
  </G>
</Svg>
)

export const TabLoginIcon = ({color, opacity}: {color: string, opacity: number}) => (
  <Svg
  width={15.145}
  height={20.012}
>
  <G fill={color} opacity={opacity} transform="translate(-64 -.476)">
    <Circle
      cx={4.958}
      cy={4.958}
      r={4.958}
      data-name="Ellipse 500"
      transform="translate(66.615 .476)"
    />
    <Path
      d="M71.573 12.074A7.581 7.581 0 0 0 64 19.647a.841.841 0 0 0 .841.841H78.3a.841.841 0 0 0 .841-.841 7.581 7.581 0 0 0-7.568-7.573Z"
      data-name="Trac\xE9 37910"
    />
  </G>
</Svg>
)