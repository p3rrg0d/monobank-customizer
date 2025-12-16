import { hexToRgba } from './utils.js';

export function getBackgroundCSS(type, solidColor, solidOpacity, gradString) {
    if (type === "solid") {
        return hexToRgba(solidColor, solidOpacity);
    }
    return gradString;
}

const QR_FRAMES = {
    standard: `url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTk4IiBoZWlnaHQ9IjE5OCIgdmlld0JveD0iMCAwIDE5OCAxOTgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGNsaXAtcGF0aD0idXJsKCNjbGlwMF81Xzc5MSkiPgo8ZyBvcGFjaXR5PSIwLjgiIGZpbHRlcj0idXJsKCNmaWx0ZXIwX2ZfNV83OTEpIj4KPHJlY3QgeD0iNTEuMzYyNyIgeT0iMTEwLjc3MiIgd2lkdGg9Ijk1LjI2MzMiIGhlaWdodD0iNTEuNzUzOCIgZmlsbD0iYmxhY2siLz4KPC9nPgo8cGF0aCBkPSJNMTMxLjg3MiAyMC4yNTZDMTI4LjI3NCAxOC43NjQ1IDEwNy42OTIgMzAuMzc0NiAxMDcuNjkyIDMwLjM3NDZMMTMxLjYxIDM2LjkzMThDMTMzLjI2MyAyOC41MjAyIDEzNC4wMjMgMjEuMTQ3OCAxMzEuODcyIDIwLjI1NloiIGZpbGw9IndoaXRlIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTI0Ljc2NiAzNy44MjY3QzEyNS40MjkgMzQuMTk5MiAxMjguNDc2IDI1Ljc1NTIgMTMxLjg4NyAyMC4xNDg5IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNOTQuNDY0NCAzMS4zNzFDOTQuNDY0NCAzMS4zNzEgODMuNjUwNCA5LjQ0NjQ0IDc5LjgwMyA4Ljg0Nzk5Qzc0LjE2OTYgNy45NzE2NCA2My4yOTQ4IDQ5LjM4ODkgNjMuMjk0OCA0OS4zODg5IiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNOTQuNDY0NCAzMS4zNzFDOTQuNDY0NCAzMS4zNzEgODMuNjUwNCA5LjQ0NjQ0IDc5LjgwMyA4Ljg0Nzk5Qzc0LjE2OTYgNy45NzE2NCA2My4yOTQ4IDQ5LjM4ODkgNjMuMjk0OCA0OS4zODg5IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNNzcuMzkyMyAzNS44NDQxQzc4LjI5NTggMjguMjAwOCA4MC4yNTA5IDE0LjUxNzUgNzkuNzczNiA4Ljk2MTQxIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cmVjdCB4PSIzOC44MDkyIiB5PSIzMS4xMzY4IiB3aWR0aD0iMTE3LjcyNSIgaGVpZ2h0PSIxMTguMTM5IiByeD0iMjIiIGZpbGw9IndoaXRlIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiLz4KPHBhdGggZD0iTTQyLjMyNDkgMjUuNTk3NkMzNy4zNDY3IDI2Ljk0MzIgMjkuMjU1MSAzNC41NjgzIDI5LjkyNjYgNDQuNTE4OUMzMC4yNDU2IDQ5LjI0NTEgMzYuNTY0OSA1My45NzE3IDM4LjM2ODIgNTMuNzY4MUMzOS44NzA1IDUzLjU5ODUgMzkuNTQ2NSA1MC4yMjUyIDM5LjU0NjUgNDkuNjM0NkMzOS41NDY0IDQ5LjA0NDEgMzguOTU2OCA0OC40NTM1IDQyLjEwMzggNDcuNzE0NUM0My42MDgyIDQ3LjM2MTIgNDQuNzExMSA0Ny4zNDI5IDQ2LjU3OTMgNDUuOTEyNkM0OC41MDY2IDQ0LjQ0NTEgNDguNDc5MiA0My4yMTYyIDQ3Ljk4OTMgNDEuMTgzOUM1MS4yMzI4IDM5Ljc3ODMgNTEuNzUxNSAzNi40ODk4IDUwLjM1ODQgMzMuNTY3NUM1MS4xMDk2IDMzLjY4NDYgNTEuNzUwMSAzMS4zNTA5IDUxLjcyMzQgMzAuMTE1OUM1MS42ODUyIDI4LjMwNjggNTEuMjI0NiAyNi45Nzk4IDQ5LjQzMzkgMjUuOTgzOEM0Ny43MjQ5IDI1LjAzMjkgNDUuOTU3OSAyNC42MTIzIDQyLjMyNDkgMjUuNTk3NloiIGZpbGw9IndoaXRlIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNNDYuOTc1NCAzMi4wNTk5QzQ4LjM4NTcgMzEuOTE1NCA0OS41NDc4IDMyLjYwODYgNTAuMjkyOCAzMy42NjczIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNNDUuMTQ2NCAzOS4wNDI4QzQ2LjUyOTYgMzkuMDQ5NSA0Ny40Nzk2IDQwLjAyNDEgNDcuOTM4NSA0MS4xNzgzIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTY0LjA0NCAxNDMuOTQ2QzE2My4wMTQgMTQ2LjQ4NiAxNjIuMjQ5IDE0OC40MTkgMTYwLjg3IDE0OS42MzRDMTU5Ljg1NSAxNTAuNTI3IDE1Ny4xMjMgMTUxLjU4MiAxNTcuMTIzIDE1MS41ODJDMTU0LjA3NSAxNTEuODYxIDE1Mi4wMjkgMTUyLjk3OCAxNTAuNTk3IDE1MS43NTNDMTQ5Ljk2NSAxNTEuMjM2IDE0OS4yMzUgMTQ5LjQ0NSAxNDkuNDA0IDE0OC4xNjFDMTQ1LjMzMyAxNDcuODM2IDE0My4zMjcgMTQzLjQyNSAxNDYuNTY5IDE0MC4wMjNMMTQ3LjAzMiAxNDAuMzQ4QzE0My41MzIgMTM2Ljg3OCAxNDcuNDMxIDEzMS4zMzggMTUxLjIwOCAxMzIuOTI4QzE1My42NzkgMTMzLjk3MiAxNTQuNjg4IDEzMy43MjcgMTU0LjY4OCAxMzMuNzI3QzE1Ni4wMjIgMTMzLjk4MSAxNTQuNjY0IDEzMi45MDkgMTU1Ljc0NSAxMzEuNTAzQzE1Ny45MzkgMTI4LjY3NSAxNjAuMjE4IDEyOS45NTIgMTYzLjA2NyAxMzMuMTM0QzE2My4wMTggMTM0LjY3MyAxNjMuNTk1IDEzNS42OTggMTYzLjgxNSAxMzYuNjc1QzE2NC40OTYgMTM5LjcwNSAxNjQuODkzIDE0MS44NTEgMTY0LjA0NCAxNDMuOTQ2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTE0Ny42NzcgMTQyLjU4OEMxNDcuMTY5IDE0Mi4xNjkgMTQ2LjUxOSAxNDEuNzc4IDE0NS43MjcgMTQxLjQxNUMxNDUuNzI3IDE0MS40MTUgMTQ1Ljc1OCAxNDEuNCAxNDUuNzQzIDE0MS4zNjhDMTQ1Ljc3NSAxNDEuMzUzIDE0NS43OTIgMTQxLjMwNiAxNDUuODIzIDE0MS4yOTFDMTQ1Ljk1MiAxNDEuMTUzIDE0Ni4wMTcgMTQxLjA0NCAxNDYuMDk5IDE0MC44ODlDMTQ2LjI0NiAxNDAuNjI1IDE0Ni4zMTYgMTQwLjI4MSAxNDYuMjkxIDEzOS45ODJDMTQ4LjMxNSAxNDEuMzkyIDE1MC44MjYgMTQyLjAyOCAxNTAuODI2IDE0Mi4wMjhDMTUwLjE1OSAxNDMuMTYxIDE0OC42NzkgMTQzLjM5NiAxNDcuNjc3IDE0Mi41ODhaIiBmaWxsPSIjNUI1QjVCIiBmaWxsLW9wYWNpdHk9IjAuMTQiLz4KPHBhdGggZD0iTTE1MC4zMDkgMTQyLjMyNkMxNDEuNDk0IDE0MC4xNzEgMTQ2Ljc0OSAxMzAuNjg2IDE1MS4wMDkgMTMzLjEzNUMxNTIuNTkgMTM0LjAxNyAxNTQuMzc2IDEzNC4xMDMgMTU0LjM3NiAxMzQuMTAzQzE1NC42MTUgMTM0LjEyNyAxNTUuMTk4IDEzNC4xMTggMTU1LjY4OCAxMzMuOTM0QzE1NC45ODYgMTMzLjU5OSAxNTQuOTE5IDEzMi45NiAxNTUuMDQgMTMyLjM3NEMxNTUuMzk0IDEzMC42NjMgMTU3Ljk0OCAxMjguMzY2IDE2Mi4xODUgMTMyLjc5NkMxNjQuMDA1IDEzNC42OTkgMTY0Ljg2MiAxMzguMTM1IDE2NC40OTIgMTQwLjkyM0MxNjQuMDU1IDE0NC4yMjQgMTYxLjQ5NiAxNTAuNDkxIDE1NS42MjggMTUyLjExNSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTQ5LjIxOCAxNDguNDI0QzE0OC40MjMgMTUwLjM1NSAxNDkuNjA3IDE1Mi42MyAxNTEuNTQ3IDE1Mi43NzVDMTUyLjc4OCAxNTIuODY4IDE1My45NSAxNTIuNTQyIDE1NS41MTEgMTUyLjE1MiIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTQ2LjM0NSAxNDAuMzE2QzE0Mi4yNjcgMTQ0LjY1OCAxNDYuNTQ3IDE1MC41MTcgMTUyLjcwNyAxNDcuNzkxIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjwvZz4KPGRlZnM+CjxmaWx0ZXIgaWQ9ImZpbHRlcjBfZl81Xzc5MSIgeD0iMTEuMzYyNyIgeT0iNzAuNzcxNSIgd2lkdGg9IjE3NS4yNjMiIGhlaWdodD0iMTMxLjc1NCIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPgo8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluPSJTb3VyY2VHcmFwaGljIiBpbjI9IkJhY2tncm91bmRJbWFnZUZpeCIgcmVzdWx0PSJzaGFwZSIvPgo8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIyMCIgcmVzdWx0PSJlZmZlY3QxX2ZvcmVncm91bmRCbHVyXzVfNzkxIi8+CjwvZmlsdGVyPgo8Y2xpcFBhdGggaWQ9ImNsaXAwXzVfNzkxIj4KPHJlY3Qgd2lkdGg9IjE5OCIgaGVpZ2h0PSIxOTgiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg==)`,

    frame1: `url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTk4IiBoZWlnaHQ9IjE5OCIgdmlld0JveD0iMCAwIDE5OCAxOTgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8ZyBjbGlwLXBhdGg9InVybCgjY2xpcDBfNV83OTEpIj4KICAgICAgICA8cGF0aCBkPSJNMTMxLjg3MiAyMC4yNTZDMTI4LjI3NCAxOC43NjQ1IDEwNy42OTIgMzAuMzc0NiAxMDcuNjkyIDMwLjM3NDZMMTMxLjYxIDM2LjkzMThDMTMzLjI2MyAyOC41MjAyIDEzNC4wMjMgMjEuMTQ3OCAxMzEuODcyIDIwLjI1NloiIGZpbGw9IndoaXRlIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgogICAgICAgIDxwYXRoIGQ9Ik0xMjQuNzY2IDM3LjgyNjdDMTI1LjQyOSAzNC4xOTkyIDEyOC40NzYgMjUuNzU1MiAxMzEuODg3IDIwLjE0ODkiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CiAgICAgICAgPHBhdGggZD0iTTk0LjQ2NDQgMzEuMzcxQzk0LjQ2NDQgMzEuMzcxIDgzLjY1MDQgOS40NDY0NCA3OS44MDMgOC44NDc5OUM3NC4xNjk2IDcuOTcxNjQgNjMuMjk0OCA0OS4zODg5IDYzLjI5NDggNDkuMzg4OSIgZmlsbD0id2hpdGUiLz4KICAgICAgICA8cGF0aCBkPSJNOTQuNDY0NCAzMS4zNzFDOTQuNDY0NCAzMS4zNzEgODMuNjUwNCA5LjQ0NjQ0IDc5LjgwMyA4Ljg0Nzk5Qzc0LjE2OTYgNy45NzE2NCA2My4yOTQ4IDQ5LjM4ODkgNjMuMjk0OCA0OS4zODg5IiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgogICAgICAgIDxwYXRoIGQ9Ik03Ny4zOTIzIDM1Ljg0NDFDNzguMjk1OCAyOC4yMDA4IDgwLjI1MDkgMTQuNTE3NSA3OS43NzM2IDguOTYxNDEiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CiAgICAgICAgPHJlY3QgeD0iMzguODA5MiIgeT0iMzEuMTM2OCIgd2lkdGg9IjExNy43MjUiIGhlaWdodD0iMTE4LjEzOSIgcng9IjIyIiBmaWxsPSJ3aGl0ZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSI0Ii8+CiAgICAgICAgPHBhdGggZD0iTTQyLjMyNDkgMjUuNTk3NkMzNy4zNDY3IDI2Ljk0MzIgMjkuMjU1MSAzNC41NjgzIDI5LjkyNjYgNDQuNTE4OUMzMC4yNDU2IDQ5LjI0NTEgMzYuNTY0OSA1My45NzE3IDM4LjM2ODIgNTMuNzY4MUMzOS44NzA1IDUzLjU5ODUgMzkuNTQ2NSA1MC4yMjUyIDM5LjU0NjUgNDkuNjM0NkMzOS41NDY0IDQ5LjA0NDEgMzguOTU2OCA0OC40NTM1IDQyLjEwMzggNDcuNzE0NUM0My42MDgyIDQ3LjM2MTIgNDQuNzExMSA0Ny4zNDI5IDQ2LjU3OTMgNDUuOTEyNkM0OC41MDY2IDQ0LjQ0NTEgNDguNDc5MiA0My4yMTYyIDQ3Ljk4OTMgNDEuMTgzOUM1MS4yMzI4IDM5Ljc3ODMgNTEuNzUxNSAzNi40ODk4IDUwLjM1ODQgMzMuNTY3NUM1MS4xMDk2IDMzLjY4NDYgNTEuNzUwMSAzMS4zNTA5IDUxLjcyMzQgMzAuMTE1OUM1MS42ODUyIDI4LjMwNjggNTEuMjI0NiAyNi45Nzk4IDQ5LjQzMzkgMjUuOTgzOEM0Ny43MjQ5IDI1LjAzMjkgNDUuOTU3OSAyNC42MTIzIDQyLjMyNDkgMjUuNTk3NloiIGZpbGw9IndoaXRlIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgogICAgICAgIDxwYXRoIGQ9Ik00Ni45NzU0IDMyLjA1OTlDNDguMzg1NyAzMS45MTU0IDQ5LjU0NzggMzIuNjA4NiA1MC4yOTI4IDMzLjY2NzMiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CiAgICAgICAgPHBhdGggZD0iTTQ1LjE0NjQgMzkuMDQyOEM0Ni41Mjk2IDM5LjA0OTUgNDcuNDc5NiA0MC4wMjQxIDQ3LjkzODUgNDEuMTc4MyIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KICAgICAgICA8cGF0aCBkPSJNMTY0LjA0NCAxNDMuOTQ2QzE2My4wMTQgMTQ2LjQ4NiAxNjIuMjQ5IDE0OC40MTkgMTYwLjg3IDE0OS42MzRDMTU5Ljg1NSAxNTAuNTI3IDE1Ny4xMjMgMTUxLjU4MiAxNTcuMTIzIDE1MS41ODJDMTU0LjA3NSAxNTEuODYxIDE1Mi4wMjkgMTUyLjk3OCAxNTAuNTk3IDE1MS43NTNDMTQ5Ljk2NSAxNTEuMjM2IDE0OS4yMzUgMTQ5LjQ0NSAxNDkuNDA0IDE0OC4xNjFDMTQ1LjMzMyAxNDcuODM2IDE0My4zMjcgMTQzLjQyNSAxNDYuNTY5IDE0MC4wMjNMMTQ3LjAzMiAxNDAuMzQ4QzE0My41MzIgMTM2Ljg3OCAxNDcuNDMxIDEzMS4zMzggMTUxLjIwOCAxMzIuOTI4QzE1My42NzkgMTMzLjk3MiAxNTQuNjg4IDEzMy43MjcgMTU0LjY4OCAxMzMuNzI3QzE1Ni4wMjIgMTMzLjk4MSAxNTQuNjY0IDEzMi45MDkgMTU1Ljc0NSAxMzEuNTAzQzE1Ny45MzkgMTI4LjY3NSAxNjAuMjE4IDEyOS45NTIgMTYzLjA2NyAxMzMuMTM0QzE2My4wMTggMTM0LjY3MyAxNjMuNTk1IDEzNS42OTggMTYzLjgxNSAxMzYuNjc1QzE2NC40OTYgMTM5LjcwNSAxNjQuODkzIDE0MS44NTEgMTY0LjA0NCAxNDMuOTQ2WiIgZmlsbD0id2hpdGUiLz4KICAgICAgICA8cGF0aCBkPSJNMTQ3LjY3NyAxNDIuNTg4QzE0Ny4xNjkgMTQyLjE2OSAxNDYuNTE5IDE0MS43NzggMTQ1LjcyNyAxNDEuNDE1QzE0NS43MjcgMTQxLjQxNSAxNDUuNzU4IDE0MS40IDE0NS43NDMgMTQxLjM2OEMxNDUuNzc1IDE0MS4zNTMgMTQ1Ljc5MiAxNDEuMzA2IDE0NS44MjMgMTQxLjI5MUMxNDUuOTUyIDE0MS4xNTMgMTQ2LjAxNyAxNDEuMDQ0IDE0Ni4wOTkgMTQwLjg4OUMxNDYuMjQ2IDE0MC42MjUgMTQ2LjMxNiAxNDAuMjgxIDE0Ni4yOTEgMTM5Ljk4MkMxNDguMzE1IDE0MS4zOTIgMTUwLjgyNiAxNDIuMDI4IDE1MC44MjYgMTQyLjAyOEMxNTAuMTU5IDE0My4xNjEgMTQ4LjY3OSAxNDMuMzk2IDE0Ny42NzcgMTQyLjU4OFoiIGZpbGw9IiM1QjVCNUIiIGZpbGwtb3BhY2l0eT0iMC4xNCIvPgogICAgICAgIDxwYXRoIGQ9Ik0xNTAuMzA5IDE0Mi4zMjZDMTQxLjQ5NCAxNDAuMTcxIDE0Ni43NDkgMTMwLjY4NiAxNTEuMDA5IDEzMy4xMzVDMTUyLjU5IDEzNC4wMTcgMTU0LjM3NiAxMzQuMTAzIDE1NC4zNzYgMTM0LjEwM0MxNTQuNjE1IDEzNC4xMjcgMTU1LjE5OCAxMzQuMTE4IDE1NS42ODggMTMzLjkzNEMxNTQuOTg2IDEzMy41OTkgMTU0LjkxOSAxMzIuOTYgMTU1LjA0IDEzMi4zNzRDMTU1LjM5NCAxMzAuNjYzIDE1Ny45NDggMTI4LjM2NiAxNjIuMTg1IDEzMi43OTZDMTY0LjAwNSAxMzQuNjk5IDE2NC44NjIgMTM4LjEzNSAxNjQuNDkyIDE0MC45MjNDMTY0LjA1NSAxNDQuMjI0IDE2MS40OTYgMTUwLjQ5MSAxNTUuNjI4IDE1Mi4xMTUiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KICAgICAgICA8cGF0aCBkPSJNMTQ5LjIxOCAxNDguNDI0QzE0OC40MjMgMTUwLjM1NSAxNDkuNjA3IDE1Mi42MyAxNTEuNTQ3IDE1Mi43NzVDMTUyLjc4OCAxNTIuODY4IDE1My45NSAxNTIuNTQyIDE1NS41MTEgMTUyLjE1MiIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgogICAgICAgIDxwYXRoIGQ9Ik0xNDYuMzQ1IDE0MC4zMTZDMTQyLjI2NyAxNDQuNjU4IDE0Ni41NDcgMTUwLjUxNyAxNTIuNzA3IDE0Ny43OTEiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KICAgIDwvZz4KICAgIDxkZWZzPgogICAgICAgIDxjbGlwUGF0aCBpZD0iY2xpcDBfNV83OTEiPgogICAgICAgICAgICA8cmVjdCB3aWR0aD0iMTk4IiBoZWlnaHQ9IjE5OCIgZmlsbD0id2hpdGUiLz4KICAgICAgICA8L2NsaXBQYXRoPgogICAgPC9kZWZzPgo8L3N2Zz4K)`,

    frame2: `url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTk4IiBoZWlnaHQ9IjE5OCIgdmlld0JveD0iMCAwIDE5OCAxOTgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3QgeD0iMzguODA5MiIgeT0iMzEuMTM2OCIgd2lkdGg9IjExNy43MjUiIGhlaWdodD0iMTE4LjEzOSIgcng9IjIyIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9ImJsYWNrIiBzdHJva2Utd2lkdGg9IjIiLz4KPC9zdmc+Cg==)`
};


export function getQRFrameSVG(frameId) {
    return QR_FRAMES[frameId] || QR_FRAMES.standard;
}

export function generateWidgetCSS(state) {
    const bg = getBackgroundCSS(
        state.bgType,
        state.bgSolidColor,
        state.bgSolidOpacity,
        state.bgGradientString
    );
    const border = `${state.borderWidth}px ${state.borderStyle} ${hexToRgba(state.borderColor, state.borderOpacity)}`;

    const trackBg = getBackgroundCSS(
        state.progTrackType,
        state.progTrackSolidColor,
        state.progTrackSolidOpacity,
        state.progTrackGradientString
    );
    const fillBg = getBackgroundCSS(
        state.progFillType,
        state.progFillSolidColor,
        state.progFillSolidOpacity,
        state.progFillGradientString
    );

    const qrFrameUrl = getQRFrameSVG(state.qrFrame);
    const qrFrameDataUri = qrFrameUrl.replace(/^url\(/, '').replace(/\)$/, '');

    const qrFrame2Styles = state.qrFrame === 'frame2' ? `
.widget.qr-container .qr {
    width: 50% !important;
}
.widget.qr-with-progress-widget .qr-side .widget.qr-container .qr {
    top: 17px !important;
    left: 13.4% !important;
    position: relative !important;
}
.widget.qr-with-progress-widget .qr-side .widget.qr-container {
    width: 180px !important;
    background-size: 100% auto !important;
    background-position-x: -20.1px !important;
    background-position-y: -19.5px !important;
    background-repeat: no-repeat !important;
    background-image: url(${qrFrameDataUri}) !important;
}` : `
.widget.qr-with-progress-widget .qr-side .widget.qr-container {
    background-image: url(${qrFrameDataUri}) !important;
}`;

    const textShadow = state.textShadowEnabled
        ? `${state.textShadowX}px ${state.textShadowY}px ${state.textShadowBlur}px ${hexToRgba(state.textShadowColor, state.textShadowOpacity)}`
        : 'none';

    return `
.widget.qr-with-progress-widget.color-scheme-black {
    border-radius: ${state.borderRadius}px !important;
    background: ${bg} !important;
    border: ${border} !important;
    color: ${state.textColor} !important;
}

.widget.qr-with-progress-widget .title,
.widget.qr-with-progress-widget .progress-container .widget .text,
.linear-horizontal-progress-widget .text .text-balance,
.linear-horizontal-progress-widget .text .text-goal {
    color: ${state.textColor} !important;
    text-shadow: ${textShadow} !important;
}

.linear-horizontal-progress-widget.shape-scheme-rounded .background,
.linear-horizontal-progress-widget.shape-scheme-rounded .progress-clip,
.linear-horizontal-progress-widget.shape-scheme-rounded .progress {
    border-radius: ${state.progressRadius}px !important;
}

.linear-horizontal-progress-widget .background {
    background: ${trackBg} !important;
}

.linear-horizontal-progress-widget.color-scheme-pink .progress {
    background: ${fillBg} !important;
}
${qrFrame2Styles}

.widget.qr-container svg path {
    fill: #ffffff !important;
}

    `.trim();
}

export class CSSExporter {
    constructor(cssExportElement, onFirstCopy) {
        this.cssExportElement = cssExportElement;
        this.onFirstCopy = onFirstCopy;
        this.codeBlock = null;
        this.initialized = false;
    }

    initialize() {
        if (this.initialized) return;

        this.cssExportElement.innerHTML = `
            <div class="code-title">
                <span>CSS код</span>
            </div>
            <pre></pre>
            <div style="display: flex; gap: 10px; margin-top: 24px;">
                <button class="copy-btn-wide" id="copyBtn" style="margin-top: 0; flex-grow: 1;">Скопіювати CSS код</button>
                <button id="tutorial-btn" class="tutorial-btn-secondary" title="Інструкція">?</button>
            </div>
        `;

        this.codeBlock = this.cssExportElement.querySelector("pre");
        this.initCopyButton();
        this.initialized = true;
    }

    initCopyButton() {
        const copyBtn = this.cssExportElement.querySelector("#copyBtn");
        if (!copyBtn) return;

        copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(this.codeBlock.textContent).then(() => {
                // Check if first time
                if (!localStorage.getItem('monobank_widget_css_copied')) {
                    localStorage.setItem('monobank_widget_css_copied', 'true');
                    if (this.onFirstCopy) {
                        this.onFirstCopy();
                    }
                }

                const originalText = copyBtn.textContent;
                copyBtn.textContent = "Скопійовано!";
                copyBtn.style.background = "var(--accent-secondary)";
                copyBtn.style.color = "var(--text-main)";

                // Highlight tutorial button
                const tutorialBtn = document.getElementById("tutorial-btn");
                if (tutorialBtn) {
                    tutorialBtn.classList.add("tutorial-highlight");
                    // Remove class after animation or when user clicks it (optional, handled by click)
                    setTimeout(() => {
                        tutorialBtn.classList.remove("tutorial-highlight");
                    }, 3000); // 3 seconds (2 full loops of 1.5s)
                }

                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.background = "";
                    copyBtn.style.color = "";
                }, 2000);
            });
        });
    }



    updateCSS(css) {
        if (!this.initialized) {
            this.initialize();
        }
        this.codeBlock.textContent = css;
    }
}
