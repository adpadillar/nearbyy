---
title: Introduction to Nearbyy
description: Introduction to Nearbyy
sidebar:
  order: 0
---

:::caution[Nearbyy is currently in ALPHA]
Nearbyy is currently in alpha, and breaking changes may be introduced at any time. If you find any bugs or have any suggestions, please contact us.
:::

Nearbyy is a platform that allows you to integrate Retrieval Augmented Generation (RAG) into your applications. It provides a simple API that allows you to upload and retrieve files from the Nearbyy platform.

## Retrieval Augmented Generation

In this section, we will give a brief introduction to Retrieval Augmented Generation (RAG), and why would you want to integrate it into your applications.

### What is RAG?

Retrieval Augmented Generation (_RAG_) is an approach to text generation that combines the benefits of both retrieval-based and generation-based approaches. It combines the generative capabilities of modern Large Language Models (_LLMs_) with the ability to retrieve relevant information from a large corpus of documents (_the knowledge base_).

### Why RAG?

Modern LLMs like GPT-4 are capable of generating high-quality text. However, they suffer from several problems:

- **Hallucination**: LLMs often generate "made-up" facts that are not true.
- **Customizability**: LLMs don't normally use the information on a specific knowledge base.
- **Relevance**: LLMs often generate text that is not relevant or up-to-date.

RAG solves these problems by using a knowledge base to retrieve relevant information that is provided to the LLM as context. This allows the LLM to generate text that is relevant and up-to-date.

## How Nearbyy works

Nearbyy is a platform that allows you to integrate RAG into your applications. All you have to do is create a Nearbyy project, upload your knowledge base, and use the Nearbyy API to retrieve information from your knowledge base.

## Further reading

In the next section, we will be setting up our first Nearbyy project with Typescript.
