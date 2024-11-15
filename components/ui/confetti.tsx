"use client";
import confetti from "canvas-confetti";
import type { ReactNode } from "react";
import React, {
  createContext,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";

import type {
  GlobalOptions as ConfettiGlobalOptions,
  CreateTypes as ConfettiInstance,
  Options as ConfettiOptions,
} from "canvas-confetti";
import { Button } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";

interface Api {
  fire: (options?: ConfettiOptions) => void;
}

type Props = React.ComponentPropsWithRef<"canvas"> & {
  options?: ConfettiOptions;
  globalOptions?: ConfettiGlobalOptions;
  manualstart?: boolean;
  children?: ReactNode;
};

export type ConfettiRef = Api | null;

const ConfettiContext = createContext<Api>({} as Api);

const Confetti = forwardRef<ConfettiRef, Props>((props, ref) => {
  const {
    options,
    globalOptions = { resize: true, useWorker: true },
    manualstart = false,
    children,
    ...rest
  } = props;
  const instanceRef = useRef<ConfettiInstance | null>(null); // confetti instance

  const canvasRef = useCallback(
    // https://react.dev/reference/react-dom/components/common#ref-callback
    // https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
    (node: HTMLCanvasElement) => {
      if (node !== null) {
        // <canvas> is mounted => create the confetti instance
        if (instanceRef.current) return; // if not already created
        instanceRef.current = confetti.create(node, {
          ...globalOptions,
          resize: true,
        });
      } else {
        // <canvas> is unmounted => reset and destroy instanceRef
        if (instanceRef.current) {
          instanceRef.current.reset();
          instanceRef.current = null;
        }
      }
    },
    [globalOptions]
  );

  // `fire` is a function that calls the instance() with `opts` merged with `options`
  const fire = useCallback(
    (opts = {}) => instanceRef.current?.({ ...options, ...opts }),
    [options]
  );

  const api = useMemo(
    () => ({
      fire,
    }),
    [fire]
  );

  useImperativeHandle(ref, () => api, [api]);

  useEffect(() => {
    if (!manualstart) fire();
  }, [manualstart, fire]);

  return (
    <ConfettiContext.Provider value={api}>
      <canvas ref={canvasRef} {...rest} />
      {children}
    </ConfettiContext.Provider>
  );
});
Confetti.displayName = "Confetti";

interface ConfettiButtonProps extends ButtonProps {
  options?: ConfettiOptions &
    ConfettiGlobalOptions & { canvas?: HTMLCanvasElement };
  children?: React.ReactNode;
}

function ConfettiButton({ options, children, ...props }: ConfettiButtonProps) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    confetti({
      ...options,
      origin: {
        x: x / window.innerWidth,
        y: y / window.innerHeight,
      },
    });
  };

  return (
    <Button onClick={handleClick} {...props}>
      {children}
    </Button>
  );
}
ConfettiButton.displayName = "ConfettiButton";

interface ConfettiEmojiProps {
  targetRef?: React.RefObject<HTMLElement>;
  children?: React.ReactNode;
  onTrigger?: () => void;
  autoTrigger?: boolean;
  confettiAmount?: number;
}

function ConfettiEmoji({
  targetRef,
  children,
  onTrigger,
  autoTrigger = false,
  confettiAmount = 30,
}: ConfettiEmojiProps) {
  const handleConfetti = useCallback(() => {
    const scalar = 2;
    const link = confetti.shapeFromText({ text: "🔗", scalar });
    const doubleLink = confetti.shapeFromText({ text: "🖇️", scalar });
    const star = confetti.shapeFromText({ text: "✨", scalar });

    const element = targetRef?.current;
    const origin = element
      ? {
          x:
            (element.getBoundingClientRect().left +
              element.getBoundingClientRect().width / 2) /
            window.innerWidth,
          y:
            (element.getBoundingClientRect().top +
              element.getBoundingClientRect().height / 2) /
            window.innerHeight,
        }
      : undefined;

    const defaults = {
      spread: 360,
      ticks: 60,
      gravity: 0,
      decay: 0.96,
      startVelocity: 20,
      shapes: [link],
      scalar,
      origin,
    };

    const shoot = () => {
      confetti({
        ...defaults,
        particleCount: confettiAmount,
      });

      confetti({
        ...defaults,
        particleCount: 5,
      });

      confetti({
        ...defaults,
        particleCount: 15,
        scalar: scalar / 2,
        shapes: [star],
      });
    };

    setTimeout(shoot, 0);
    setTimeout(shoot, 100);
    setTimeout(shoot, 200);

    onTrigger?.();
  }, [targetRef, onTrigger, confettiAmount]);

  useEffect(() => {
    if (autoTrigger) {
      handleConfetti();
    }
  }, [autoTrigger, handleConfetti]);

  if (children) {
    return <div onClick={handleConfetti}>{children}</div>;
  }

  return <div onClick={handleConfetti} />;
}

export { Confetti, ConfettiButton, ConfettiEmoji };
