import prisma from "../config/database.js";

export const create = async (req, res) => {
  try {
    const { nome, professorId } = req.body;

    // Validação dos campos obrigatórios
    if (!nome || professorId === undefined) {
      return res.status(400).json({
        success: false,
        message: "Nome e professorId são obrigatórios",
      });
    }

    // Validação do ID
    if (!Number.isInteger(Number(professorId)) || Number(professorId) <= 0) {
      return res.status(400).json({
        success: false,
        message: "professorId deve ser um número inteiro positivo",
      });
    }

    // Verifica se o professor existe
    const professor = await prisma.user.findUnique({
      where: {
        id: Number(professorId),
      },
    });

    if (!professor) {
      return res.status(404).json({
        success: false,
        message: "Professor não encontrado",
      });
    }

    // Criação da disciplina
    const subject = await prisma.subject.create({
      data: {
        nome,
        professorId: Number(professorId),
      },
      select: {
        id: true,
        nome: true,
        ativa: true,
        professorId: true,

        // Dados do professor
        professor: {
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
      data: subject,
    });
  } catch (error) {
    console.error("Erro ao criar disciplina:", error);

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      select: {
        id: true,
        nome: true,
        ativa: true,
        professorId: true,

        // Dados do professor
        professor: {
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
      data: subjects,
      total: subjects.length,
    });
  } catch (error) {
    console.error("Erro ao buscar disciplinas:", error);

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

    const subject = await prisma.subject.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        nome: true,
        ativa: true,
        professorId: true,

        // Dados do professor
        professor: {
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

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Disciplina não encontrada",
      });
    }

    return res.status(200).json({
      success: true,
      data: subject,
    });
  } catch (error) {
    console.error("Erro ao buscar disciplina:", error);

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};