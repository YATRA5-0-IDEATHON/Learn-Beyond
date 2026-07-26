"""One-off helper: generate broad sample problem-brief PDFs for the AI Chain
Builder demo. Run:  python make_sample_pdfs.py

Creates ../test-briefs/blockchain-brief.pdf and ../test-briefs/finance-brief.pdf
Each brief is intentionally detailed so Gemini produces a rich 5-6 task chain.
"""
import os
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer

OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "test-briefs")
os.makedirs(OUT_DIR, exist_ok=True)

styles = getSampleStyleSheet()
h1 = ParagraphStyle("h1b", parent=styles["Heading1"], spaceAfter=10)
h2 = ParagraphStyle("h2b", parent=styles["Heading2"], spaceBefore=8, spaceAfter=6)
body = ParagraphStyle("bodyb", parent=styles["BodyText"], leading=15, spaceAfter=6)


def build(filename, blocks):
    path = os.path.join(OUT_DIR, filename)
    doc = SimpleDocTemplate(path, pagesize=LETTER,
                            topMargin=0.8 * inch, bottomMargin=0.8 * inch)
    flow = []
    for kind, text in blocks:
        if kind == "h1":
            flow.append(Paragraph(text, h1))
        elif kind == "h2":
            flow.append(Paragraph(text, h2))
        elif kind == "space":
            flow.append(Spacer(1, 0.15 * inch))
        else:
            flow.append(Paragraph(text, body))
    doc.build(flow)
    print("wrote", os.path.abspath(path))


BLOCKCHAIN = [
    ("h1", "Project Brief: Build &amp; Deploy a Token dApp on Ethereum"),
    ("body", "You are joining a small Web3 startup as a junior smart contract "
             "developer. Your onboarding project is to design, build, test, deploy "
             "and secure a complete decentralized application (dApp) around a custom "
             "ERC-20 token called <b>LearnToken (LRN)</b>. This brief describes the "
             "full scope of work expected before the project can go live."),

    ("h2", "1. Background &amp; Learning Goals"),
    ("body", "Before writing code, you must understand the fundamentals of how "
             "Ethereum works: blocks, transactions, gas, hashing, Proof-of-Stake "
             "consensus, externally owned accounts vs contract accounts, and the "
             "Ethereum Virtual Machine (EVM). You should be able to explain why a "
             "deployed smart contract is immutable and what that means for security."),

    ("h2", "2. Smart Contract Requirements"),
    ("body", "Implement the LearnToken contract in Solidity (0.8+). It must expose a "
             "name, symbol, 18 decimals, a fixed total supply minted to the deployer, "
             "a balances mapping, a transfer() function, an approve()/transferFrom() "
             "allowance flow, and emit standard Transfer and Approval events. All state "
             "changes must be guarded with require() checks (e.g. insufficient balance)."),

    ("h2", "3. Testing Requirements"),
    ("body", "Set up a Hardhat project and write automated unit tests with ethers.js. "
             "Cover the happy paths (successful transfer and approval) and the failure "
             "paths (transfer more than balance, transferFrom without allowance). Aim "
             "for high test coverage and keep the project version-controlled on GitHub "
             "with meaningful commits and a clear README."),

    ("h2", "4. Deployment Requirements"),
    ("body", "Deploy the audited contract to the Sepolia public testnet using an "
             "Alchemy or Infura RPC endpoint. Keep your private key in a .env file and "
             "never commit it. After deployment, verify the source code on Etherscan so "
             "anyone can read and interact with the contract, and record the live "
             "contract address."),

    ("h2", "5. Frontend dApp Requirements"),
    ("body", "Build a React frontend that connects to MetaMask, displays the connected "
             "wallet address and its LRN balance, and lets the user transfer tokens to "
             "another address through the deployed contract. Handle the no-wallet case "
             "gracefully and show a pending state while a transaction confirms."),

    ("h2", "6. Security &amp; Audit Requirements"),
    ("body", "Finally, review the contract against common vulnerabilities: reentrancy, "
             "integer overflow/underflow, and missing access control on privileged "
             "functions. Produce a short security report that lists each risk checked, "
             "whether the contract is affected, and the mitigation applied. Reference the "
             "SWC registry and follow the Checks-Effects-Interactions pattern."),

    ("h2", "Deliverables Summary"),
    ("body", "An explainer of Ethereum fundamentals; the Solidity contract source; a "
             "tested Hardhat GitHub repo; a verified Etherscan contract URL; a screenshot "
             "of the working dApp; and a written security audit report."),
]

FINANCE = [
    ("h1", "Assignment Brief: Financial Analysis &amp; Investment Recommendation"),
    ("body", "You have joined the equity research desk of an investment firm as a "
             "junior finance analyst. Your task is to analyze a mid-sized consumer goods "
             "company, <b>Himalayan Foods Ltd.</b>, and produce a complete investment "
             "recommendation for the portfolio committee. This brief outlines every "
             "deliverable expected."),

    ("h2", "1. Understand the Financial Statements"),
    ("body", "Begin by reading the company's most recent annual report. Summarize the "
             "income statement, balance sheet, and cash flow statement in plain language. "
             "Explain the relationship between the three statements and highlight where "
             "the company earns and spends its money."),

    ("h2", "2. Build a Financial Model"),
    ("body", "Construct a 12-month revenue and expense projection in a spreadsheet. "
             "Clearly state your assumptions for revenue growth, cost of goods sold, "
             "operating expenses, and seasonality. The model should output projected "
             "monthly net profit and a simple cash-flow forecast. Submit the spreadsheet "
             "file."),

    ("h2", "3. Ratio &amp; Trend Analysis"),
    ("body", "Compute and interpret at least five key financial ratios: current ratio, "
             "gross margin, net profit margin, return on equity, and debt-to-equity. "
             "Compare each ratio against industry benchmarks and explain what the trend "
             "tells you about the company's financial health."),

    ("h2", "4. Visualize the Data"),
    ("body", "Create clear charts that communicate your findings: a bar chart comparing "
             "expense categories, and a line chart showing the revenue trend and "
             "projection. Submit an image of your most important chart with a short "
             "caption explaining the key insight."),

    ("h2", "5. Investment Recommendation Memo"),
    ("body", "Write a concise one-page investment memo. Lead with your recommendation "
             "(buy, hold, or sell), support it with the evidence from your model and "
             "ratio analysis, state the key risks, and give a target price or valuation "
             "range. Use correct financial terminology throughout."),

    ("h2", "Deliverables Summary"),
    ("body", "A plain-language statement summary; a financial model spreadsheet; a ratio "
             "analysis with benchmarks; a chart image; and a one-page investment "
             "recommendation memo."),
]

if __name__ == "__main__":
    build("blockchain-brief.pdf", BLOCKCHAIN)
    build("finance-brief.pdf", FINANCE)
    print("Done.")
