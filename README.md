# Galley CLASP (Google's Command Line Apps Script Projects)

This is a repo for GAS (Google App Script) integrations with the Galley API. GAS allows us to integrate with the Galley GraphQL API in Google Docs (like Sheets and Docs). The goal of this repo is to provide utility functions to use as a starting point for things like Menu Planner Google Sheets we build for customers.

# Installation

`yarn install`

# Development

The project is setup to support typescript. CLASP will compile the TS and publish the built Javascript. You can add files in any location and they'll get picked up and published to the App Script Project.

When you're ready to push the changes to the project, run `yarn push`. You can also run `yarn push:watch` to continuously push changes as you work.
