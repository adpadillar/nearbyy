---
title: Introduction to Nearbyy
description: Introduction to Nearbyy
sidebar:
  order: 0
---

:::caution[Nearbyy is currently in ALPHA]
Nearbyy is currently in alpha, and breaking changes may be introduced at any time. If you find any bugs or have any suggestions, [please contact us here](mailto:adpadillar25@gmail.com).
:::

Nearbyy is a platform that allows you to integrate Retrieval Augmented Generation (RAG) into your applications. It provides a simple API that allows you to upload and retrieve files from the Nearbyy platform.

## Retrieval Augmented Generation

In this section, we will give a brief introduction to Retrieval Augmented Generation (RAG), and why would you want to integrate it into your applications.

### What is RAG?

Retrieval Augmented Generation (_RAG_) is an approach to text generation that combines the benefits of both retrieval-based and generation-based approaches. It combines the generative capabilities of modern Large Language Models (_LLMs_) like GPT-4, Llama-2, and Mixtral, with the ability to retrieve relevant information from a large corpus of documents (_the knowledge base_).

### Why RAG?

Modern LLMs like are capable of generating high-quality text. However, they suffer from several problems:

- **Hallucination**: LLMs often generate "made-up" facts that are not true.
- **Customizability**: LLMs don't normally use the information on a specific knowledge base.
- **Relevance**: LLMs often generate text that is not relevant or up-to-date.

RAG solves these problems by using a knowledge base to retrieve relevant information that is provided to the LLM as context. This means that as long as this knowledge base is updated, the LLM to generate text that is relevant and up-to-date.

### Why Nearbyy?

Nearbyy is a platform that allows you to integrate RAG into your applications. It allows you to solve these common problems when implementing a system like this yourself:

- **Reduce complexity**: We abstract the complexity of setting up the infrastructure to host a knowledge base
- **Retrieval performance**: We are focused on making retrieval as accurate and fast as possible, so you don't have to worry about it.
- **Deployment**: As simple as creating and API key and using it. All the infrastructure is managed by us.
- **API first**: Keep your knowledge base up-to-date by integrating Nearbyy into your existing workflows.
- **Developer experience**: We are focused on making the developer experience as smooth as possible.

This is a simplified overview of the nearbyy platform. Click on the image below to open the full-size image.

[![](/infra.png)](/infra.png)

## Further reading

In the next section, we will be setting up our first Nearbyy project with Typescript.
