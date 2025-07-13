"use client";

import { Fragment } from "react";

import { withAuth } from "@/shared/HOC";

interface IProps {
  children: React.ReactNode;
}

function Layout({ children }: IProps) {
  return (
    <Fragment>
      {children}
    </Fragment>
  );
}

export default withAuth(Layout);
