import prisma from "../config/database.js";

export const create = async (req, res) => {
  try {
    const {
      enunciado,
      dificuldade,
      respostaCorreta,
      subjectId,
      authorId,
    } = req.body;

    // Validação dos campos obrigatórios
    if (
      !enunciado ||
      dificuldade === undefined ||
      subjectId === undefined ||
      authorId === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Enunciado, dificuldade, subjectId e authorId são obrigatórios",
      });
    }

    // Validação da dificuldade
    if (
      !Number.isInteger(Number(dificuldade)) ||
      Number(dificuldade) < 1 ||
      Number(dificuldade) > 3
    ) {
      return res.status(400).json({
        success: false,
        message: "Dificuldade deve ser um número inteiro entre 1 e 3",
      });
    }

    // Validação do subjectId
    if (!Number.isInteger(Number(subjectId)) || Number(subjectId) <= 0) {
      return res.status(400).json({
        success: false,
        message: "subjectId deve ser um número inteiro positivo",
      });
    }

    // Validação do authorId
    if (!Number.isInteger(Number(authorId)) || Number(authorId) <= 0) {
      return res.status(400).json({
        success: false,
        message: "authorId deve ser um número inteiro positivo",
      });
    }

    // Verifica se a matéria existe
    const subject = await prisma.subject.findUnique({
      where: {
        id: Number(subjectId),
      },
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Matéria não encontrada",
      });
    }

    // Verifica se o autor existe
    const author = await prisma.user.findUnique({
      where: {
        id: Number(authorId),
      },
    });

    if (!author) {
      return res.status(404).json({
        success: false,
        message: "Autor não encontrado",
      });
    }

    // Criação da questão
    const question = await prisma.question.create({
      data: {
        enunciado,
        dificuldade: Number(dificuldade),
        respostaCorreta: respostaCorreta || null,
        subjectId: Number(subjectId),
        authorId: Number(authorId),
      },
      select: {
        id: true,
        enunciado: true,
        dificuldade: true,
        respostaCorreta: true,
        subjectId: true,
        authorId: true,
        ativa: true,

        // Dados da matéria
        subject: {
          select: {
            id: true,
            nome: true,
            ativa: true,
          },
        },

        // Dados do autor
        author: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },

        createdAt: true,
        updatedAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error("Erro ao criar questão:", error);

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const questions = await prisma.question.findMany({
      select: {
        id: true,
        enunciado: true,
        dificuldade: true,
        respostaCorreta: true,
        subjectId: true,
        authorId: true,
        ativa: true,

        // Dados da matéria
        subject: {
          select: {
            id: true,
            nome: true,
            ativa: true,
          },
        },

        // Dados do autor
        author: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },

        createdAt: true,
        updatedAt: true,
      },

      orderBy: {
        id: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      data: questions,
      total: questions.length,
    });
  } catch (error) {
    console.error("Erro ao buscar questões:", error);

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

export const getById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Validação do ID
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "ID deve ser um número inteiro positivo",
      });
    }

    const question = await prisma.question.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        enunciado: true,
        dificuldade: true,
        respostaCorreta: true,
        subjectId: true,
        authorId: true,
        ativa: true,

        // Dados da matéria
        subject: {
          select: {
            id: true,
            nome: true,
            ativa: true,
          },
        },

        // Dados do autor
        author: {
          select: {
            id: true,
            nome: true,
            email: true,
          },
        },

        createdAt: true,
        updatedAt: true,
      },
    });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Questão não encontrada",
      });
    }

    return res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error("Erro ao buscar questão:", error);

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};