
import React from 'react';

// Fix: Explicitly type commonIconProps to ensure its compatibility with React.SVGAttributes,
// which helps TypeScript correctly infer the types of the functional components that use it.
// This resolves type inference issues for subsequent icon components using these props.
const commonIconProps: Partial<React.SVGAttributes<SVGSVGElement>> = { className: "w-5 h-5" };


export const PlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    className: "w-5 h-5", // Default, can be overridden by props
    ...props
  },
    React.createElement('path', {
      fillRule: "evenodd",
      d: "M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z",
      clipRule: "evenodd"
    })
  )
);

export const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    className: "w-5 h-5",
    ...props
  },
    React.createElement('path', {
      fillRule: "evenodd",
      d: "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z",
      clipRule: "evenodd"
    })
  )
);

export const SteamIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
 React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    className: "w-5 h-5",
    ...props
  },
  React.createElement('path', {
    d: "M12.019 8.943c-2.03 0-3.66 1.585-3.66 3.543s1.63 3.543 3.66 3.543c1.266 0 2.446-.63 3.122-1.705l2.707 1.563c.04.023.08.035.122.035.183 0 .347-.104.41-.277.064-.172.01-.374-.128-.49l-2.35-2.03c.473-.754.717-1.61.717-2.488 0-1.958-1.63-3.7-3.66-3.7zm.03 5.586c-1.157 0-2.1-.867-2.1-1.96s.943-1.96 2.1-1.96 2.1.866 2.1 1.96-.943 1.96-2.1 1.96zm6.325-2.757c.182-.385.283-.8.283-1.23 0-.93-.382-1.787-.99-2.4L15.88 6.458c-.163-.13-.38-.148-.56-.046-.18.104-.28.305-.243.507l1.27 6.928c.02.098.07.187.14.256l2.803 2.804c.094.093.22.14.35.14.068 0 .138-.013.204-.04.17-.07.283-.23.283-.41V11.77zm-14.458.003L1.78 8.988c-.138-.116-.33-.12-.492-.01-.164.11-.238.31-.18.49l2.27 6.395c.07.188.234.31.42.31h.003c.132 0 .26-.05.353-.14l2.806-2.802c.07-.07.12-.16.14-.258l1.27-6.927c.037-.202-.063-.403-.243-.508-.18-.1-.397-.082-.56.048l-1.788 1.682c-.607.613-.99 1.47-.99 2.4 0 .43.1.844.282 1.228v.002zM12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 21.6c-5.302 0-9.6-4.298-9.6-9.6S6.698 2.4 12 2.4s9.6 4.298 9.6 9.6-4.298 9.6-9.6 9.6z"
  })
 )
);

export const SkullIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    className: "w-5 h-5",
    ...props
  },
    React.createElement('path', {
      d: "M12.378 1.602a.75.75 0 0 0-.756 0L3.75 6.332A.75.75 0 0 0 3 7.017V13.3c-.01 5.98 3.984 10.023 8.495 10.64a.75.75 0 0 0 .01 0c4.512-.617 8.505-4.66 8.495-10.64V7.017a.75.75 0 0 0-.75-0.685L12.378 1.602ZM12 7.5a1.125 1.125 0 1 1 0 2.25 1.125 1.125 0 0 1 0-2.25Zm-3 3.375A1.125 1.125 0 1 1 7.875 12 1.125 1.125 0 0 1 9 10.875Zm6 0a1.125 1.125 0 1 1-2.25 0 1.125 1.125 0 0 1 2.25 0Zm-3.328 3.283a.75.75 0 0 1 .042 1.06c-.29.328-.563.661-.786 1.003a.75.75 0 0 1-1.328-.618c.124-.19.258-.378.397-.561l-.22-.127a.75.75 0 0 1 .654-1.298l.036.02a3.05 3.05 0 0 0 1.177.492l.027.004a.75.75 0 0 1 .001.025Z"
    }),
    React.createElement('path', {
      d: "M12.792 14.121a.75.75 0 0 1-1.017-.497c-.22-.512-.706-.863-1.242-1.026-.207-.063-.395-.154-.563-.269a.75.75 0 0 1 .6-1.35c.291.194.558.417.792.668.88.933 2.193 1.254 3.43.861a.75.75 0 0 1 .53 1.394c-.871.273-1.752.248-2.53.068Z"
    })
  )
);

export const QuestionMarkCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    className: "w-5 h-5",
    ...props
  },
    React.createElement('path', {
      fillRule: "evenodd",
      d: "M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.882-.41-1.9.227-1.9 1.167v.111c0 .331.148.647.406.862l.16.133c.202.168.455.334.738.515.229.146.476.318.69.525.19.182.333.39.43.628.082.204.127.423.127.651 0 .308-.054.61-.156.899-.103.29-.273.57-.502.824-.228.253-.527.472-.883.653-.355.18-.767.302-1.226.363-.229.03-.458.044-.69.044a8.198 8.198 0 0 1-2.788-.575.75.75 0 0 1-.51-1.36c.11-.37.383-.655.727-.808.687-.306 1.423-.532 2.193-.648.2-.029.385-.07.556-.124.17-.055.316-.126.438-.211l.16-.116c.19-.137.343-.295.462-.47.12-.176.18-.38.18-.593 0-.357-.125-.687-.356-.947-.133-.15-.303-.283-.506-.396Z",
      clipRule: "evenodd"
    })
  )
);


export const ArrowUpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    className: "w-5 h-5",
    ...props
  },
    React.createElement('path', {
      fillRule: "evenodd",
      d: "M10 17a.75.75 0 0 1-.75-.75V5.56l-2.47 2.47a.75.75 0 0 1-1.06-1.06l4-4a.75.75 0 0 1 1.06 0l4 4a.75.75 0 1 1-1.06 1.06L10.75 5.56V16.25A.75.75 0 0 1 10 17Z",
      clipRule: "evenodd"
    })
  )
);

export const ArrowDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    className: "w-5 h-5",
    ...props
  },
    React.createElement('path', {
      fillRule: "evenodd",
      d: "M10 3a.75.75 0 0 1 .75.75v10.69l2.47-2.47a.75.75 0 1 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-4-4a.75.75 0 1 1 1.06-1.06l2.47 2.47V3.75A.75.75 0 0 1 10 3Z",
      clipRule: "evenodd"
    })
  )
);

export const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    className: "w-5 h-5",
    ...props
  },
    React.createElement('path', {
      fillRule: "evenodd",
      d: "M17 10a.75.75 0 0 1-.75.75H5.56l2.47 2.47a.75.75 0 1 1-1.06 1.06l-4-4a.75.75 0 0 1 0-1.06l4-4a.75.75 0 0 1 1.06 1.06L5.56 9.25H16.25A.75.75 0 0 1 17 10Z",
      clipRule: "evenodd"
    })
  )
);

export const ArrowRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    className: "w-5 h-5",
    ...props
  },
    React.createElement('path', {
      fillRule: "evenodd",
      d: "M3 10a.75.75 0 0 1 .75-.75h10.69l-2.47-2.47a.75.75 0 0 1 1.06-1.06l4 4a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 0 1-1.06-1.06l2.47-2.47H3.75A.75.75 0 0 1 3 10Z",
      clipRule: "evenodd"
    })
  )
);


export const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( // Formerly TrashIcon
  React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    className: "w-5 h-5", // Default class
    ...props
  },
    React.createElement('path', {
      fillRule: "evenodd",
      d: "M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z",
      clipRule: "evenodd"
    })
  )
);

export const PlusCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    className: "w-6 h-6", // Default, can be overridden
    ...props
  },
    React.createElement('path', {
      fillRule: "evenodd",
      d: "M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z",
      clipRule: "evenodd"
    })
  )
);

export const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    className: "w-5 h-5",
    ...props
  },
    React.createElement('path', {
      d: "M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z"
    }),
    React.createElement('path', {
      d: "M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z"
    })
  )
);

export const PencilSquareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    className: "w-5 h-5",
    ...props
  },
    React.createElement('path', {
      d: "M5.433 13.917l1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z"
    }),
    React.createElement('path', {
      d: "M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z"
    })
  )
);

export const LightbulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    className: "w-5 h-5",
    ...props
  },
    React.createElement('path', {
      d: "M10 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM10 10.5A2.25 2.25 0 1 0 10 6a2.25 2.25 0 0 0 0 4.5ZM4.163 5.404a.75.75 0 0 0-.298.816A3.753 3.753 0 0 0 5.75 10a3.753 3.753 0 0 0 1.885-3.78.75.75 0 0 0-1.096-.518A2.254 2.254 0 0 1 4.163 5.404ZM15.837 5.404a.75.75 0 0 1 .298.816A3.753 3.753 0 0 1 14.25 10a3.753 3.753 0 0 1-1.885-3.78.75.75 0 0 1 1.096-.518A2.254 2.254 0 0 0 15.837 5.404ZM10 12.816A5.25 5.25 0 0 0 5.383 9.478a.75.75 0 0 0-1.108.142 6.75 6.75 0 0 0-.001 10.017.75.75 0 0 0 .831.19A5.235 5.235 0 0 0 10 18.25c2.071 0 3.88-.808 4.896-2.423a.75.75 0 0 0 .83-.19 6.75 6.75 0 0 0-.001-10.017.75.75 0 0 0-1.108-.142A5.25 5.25 0 0 0 10 12.816Z"
    })
  )
);

export const FolderArrowDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => ( 
  React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    className: "w-5 h-5",
    ...props
  },
    React.createElement('path', {
      fillRule: "evenodd",
      d: "M2 4.75C2 3.784 2.784 3 3.75 3h4.5c.706 0 1.331.343 1.722.875L10.5 4.5h5.75A1.75 1.75 0 0 1 18 6.25v8.5A1.75 1.75 0 0 1 16.25 17H3.75A1.75 1.75 0 0 1 2 15.25V4.75Zm9.74 7.82a.75.75 0 0 1 .02-1.06l.26-.26H8.5a.75.75 0 0 1 0-1.5h3.52l-.26-.26a.75.75 0 1 1 1.06-1.06l1.75 1.75a.75.75 0 0 1 0 1.06l-1.75 1.75a.75.75 0 1 1-1.08-1.04Z",
      clipRule: "evenodd"
    })
  )
);

export const RectangleGroupIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    className: "w-5 h-5",
    ...props
  },
    React.createElement('path', {
      d: "M7 3H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1ZM3 5v1h4V5H3Zm14-2h-4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Zm-4 2v1h4V5h-4ZM7 13H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1Zm-4 2v1h4v-1H3Zm14-2h-4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1Zm-4 2v1h4v-1h-4Z"
    })
  )
);

export const SquaresPlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  React.createElement('svg', {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    className: "w-5 h-5",
    ...props
  },
    React.createElement('path', {
      d: "M2 5.5A1.5 1.5 0 0 1 3.5 4h2A1.5 1.5 0 0 1 7 5.5v2A1.5 1.5 0 0 1 5.5 9h-2A1.5 1.5 0 0 1 2 7.5v-2ZM3.5 5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-2ZM2 12.5A1.5 1.5 0 0 1 3.5 11h2A1.5 1.5 0 0 1 7 12.5v2A1.5 1.5 0 0 1 5.5 16h-2A1.5 1.5 0 0 1 2 14.5v-2Zm1.5-.5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-2ZM11 5.5A1.5 1.5 0 0 1 12.5 4h2A1.5 1.5 0 0 1 16 5.5v2A1.5 1.5 0 0 1 14.5 9h-2A1.5 1.5 0 0 1 11 7.5v-2Zm1.5-.5a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 0-.5-.5h-2Zm.5 6.5a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0v-1.5h-1.5a.75.75 0 0 1 0-1.5h1.5v-1.5a.75.75 0 0 1 .75-.75Z"
    })
  )
);


export const ListBulletIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => React.createElement('svg', {...commonIconProps, ...props, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 9.75A.75.75 0 0 1 2.75 9h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 9.75Zm2.75 4.25a.75.75 0 0 0 0 1.5H17a.75.75 0 0 0 0-1.5H4.75Z", clipRule: "evenodd" }));
export const Bars3BottomLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => React.createElement('svg', {...commonIconProps, ...props, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2 9.25a.75.75 0 0 1 .75-.75h9.5a.75.75 0 0 1 0 1.5h-9.5A.75.75 0 0 1 2 9.25Zm0 4.5a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75Z", clipRule: "evenodd" }));
export const ViewColumnsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => React.createElement('svg', {...commonIconProps, ...props, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M2.25 3A.75.75 0 0 0 1.5 3.75v12.5c0 .414.336.75.75.75h15.5a.75.75 0 0 0 .75-.75V3.75A.75.75 0 0 0 17.75 3H2.25ZM3 4.5h3.5v11H3V4.5Zm5.5 0h3.5v11h-3.5V4.5Zm5.5 0H17v11h-3.5V4.5Z", clipRule: "evenodd" }));
export const CommandLineIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => React.createElement('svg', {...commonIconProps, ...props, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M6.22 8.22a.75.75 0 0 1 1.06 0l1.97 1.97L7.28 12.22a.75.75 0 0 1-1.06-1.06l1.47-1.47-1.47-1.47a.75.75 0 0 1 0-1.06ZM11.47 9.72a.75.75 0 0 1 1.06 0l1.97 1.97-1.97 1.97a.75.75 0 1 1-1.06-1.06l1.47-1.47-1.47-1.47a.75.75 0 0 1 0-1.06ZM1.75 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 .75.75v9.5A.75.75 0 0 1 17.5 16H2.5a.75.75 0 0 1-.75-.75V5.25ZM2.5 3A2.25 2.25 0 0 0 .25 5.25v9.5A2.25 2.25 0 0 0 2.5 17h15A2.25 2.25 0 0 0 19.75 14.75V5.25A2.25 2.25 0 0 0 17.5 3H2.5Z", clipRule: "evenodd" }));
export const Squares2X2Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => React.createElement('svg', {...commonIconProps, ...props, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M2.25 3A.75.75 0 0 0 1.5 3.75v3.5c0 .414.336.75.75.75h3.5A.75.75 0 0 0 8.5 7.25v-3.5A.75.75 0 0 0 7.75 3h-3.5ZM1.5 12.75A.75.75 0 0 1 2.25 12h3.5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-.75.75h-3.5a.75.75 0 0 1-.75-.75v-3.5ZM12.75 3a.75.75 0 0 0-.75.75v3.5c0 .414.336.75.75.75h3.5A.75.75 0 0 0 19.5 7.25v-3.5A.75.75 0 0 0 18.75 3h-3.5ZM12 12.75a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-.75.75h-3.5a.75.75 0 0 1-.75-.75v-3.5Z", clipRule: "evenodd" }));
export const ListOrderedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => React.createElement('svg', {...commonIconProps, ...props, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M2 4a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4Zm0 4.5A.75.75 0 0 1 2.75 8h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 8.5Zm0 4.5a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 13Zm0 4.5A.75.75 0 0 1 2.75 17h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 17.5Z", clipRule: "evenodd" }));
export const ChatBubbleBottomCenterTextIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => React.createElement('svg', {...commonIconProps, ...props, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M2.5 4A1.5 1.5 0 0 0 1 5.5V12A1.5 1.5 0 0 0 2.5 13.5H3.741a4.5 4.5 0 0 1 2.627.918.75.75 0 0 0 .983.015A4.5 4.5 0 0 1 10 12.75H10a4.5 4.5 0 0 1 2.649 1.683.75.75 0 0 0 .983-.015 4.5 4.5 0 0 1 2.627-.918H17.5A1.5 1.5 0 0 0 19 12V5.5A1.5 1.5 0 0 0 17.5 4h-15ZM3 6.75A.75.75 0 0 1 3.75 6h12.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75Zm0 3.5A.75.75 0 0 1 3.75 9.5h6.5a.75.75 0 0 1 0 1.5h-6.5A.75.75 0 0 1 3 10.25Z", clipRule: "evenodd" }));
export const CodeBracketSquareIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => React.createElement('svg', {...commonIconProps, ...props, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M2.25 3A.75.75 0 0 0 1.5 3.75v12.5c0 .414.336.75.75.75h15.5a.75.75 0 0 0 .75-.75V3.75A.75.75 0 0 0 17.75 3H2.25Zm1.513 7.526c0-.399.208-.763.533-.974l3.053-1.969a.75.75 0 0 1 .901 1.258L5.469 10l2.284 1.159a.75.75 0 0 1-.901 1.258l-3.053-1.969a1.252 1.252 0 0 1-.533-.974Zm12.474-.974c.325.211.533.575.533.974a1.252 1.252 0 0 1-.533-.974l-3.053 1.969a.75.75 0 1 1-.901-1.258L14.531 10l-2.284-1.159a.75.75 0 0 1 .901-1.258l3.053 1.969Z", clipRule: "evenodd" }));
export const TagIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => React.createElement('svg', {...commonIconProps, ...props, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.939a1.5 1.5 0 0 0-.44-1.06L12.621 3H4.5Zm4.75 3.75a.75.75 0 0 0-1.5 0v1.5h-1.5a.75.75 0 0 0 0 1.5h1.5v1.5a.75.75 0 0 0 1.5 0v-1.5h1.5a.75.75 0 0 0 0-1.5h-1.5v-1.5Z", clipRule: "evenodd" }));

export const Bars4Icon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => React.createElement('svg', {...commonIconProps, ...props, xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { fillRule: "evenodd", d: "M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75ZM2.75 8a.75.75 0 0 0 0 1.5h14.5a.75.75 0 0 0 0-1.5H2.75ZM2 12.75a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1-.75-.75Z", clipRule: "evenodd" }));
