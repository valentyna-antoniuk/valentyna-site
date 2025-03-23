import { type PropsWithChildren } from "react";
import "./styles.module.css";

export default function ReactButton({
  type = "button",
  firstColor = "#ff7eb3",
  secondColor = "#ff758c",
  children,
  ...rest
}: PropsWithChildren<ReactButtonProps>) {
  return (
    <button
      type={type}
      {...rest}
      style={
        {
          "--first-color": firstColor,
          "--second-color": secondColor,
        } as React.CSSProperties
      }
    >
      {children}
    </button>
  );
}

type ReactButtonProps = {
  type?: "button" | "submit" | "reset";
  firstColor?: string;
  secondColor?: string;
  "on:click"?: () => void;
};
