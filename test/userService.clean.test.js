const { UserService } = require('../src/userService');

const USUARIO_VALIDO = {
  nome: 'Carlos Andrade',
  email: 'carlos@email.com',
  idade: 22,
};

describe('UserService', () => {
  let service;

  beforeEach(() => {
    service = new UserService();
    service._clearDB();
  });

  // ─── createUser ────────────────────────────────────────────────────────────

  describe('createUser', () => {
    test('retorna objeto com os dados informados e status ativo', () => {
      const usuario = service.createUser(
        USUARIO_VALIDO.nome,
        USUARIO_VALIDO.email,
        USUARIO_VALIDO.idade
      );

      expect(usuario).toMatchObject({
        nome: USUARIO_VALIDO.nome,
        email: USUARIO_VALIDO.email,
        idade: USUARIO_VALIDO.idade,
        isAdmin: false,
        status: 'ativo',
      });
    });

    test('gera um identificador único do tipo string para o novo usuário', () => {
      const usuario = service.createUser(
        USUARIO_VALIDO.nome,
        USUARIO_VALIDO.email,
        USUARIO_VALIDO.idade
      );

      expect(typeof usuario.id).toBe('string');
      expect(usuario.id.length).toBeGreaterThan(0);
    });

    test('cria usuário com perfil de administrador quando o parâmetro é verdadeiro', () => {
      const admin = service.createUser('Bruna Silva', 'bruna@email.com', 30, true);

      expect(admin.isAdmin).toBe(true);
    });

    test('lança erro quando o nome não é fornecido', () => {
      expect(() => {
        service.createUser('', USUARIO_VALIDO.email, USUARIO_VALIDO.idade);
      }).toThrow('Nome, email e idade são obrigatórios.');
    });

    test('lança erro quando o email não é fornecido', () => {
      expect(() => {
        service.createUser(USUARIO_VALIDO.nome, '', USUARIO_VALIDO.idade);
      }).toThrow('Nome, email e idade são obrigatórios.');
    });

    test('lança erro quando a idade não é fornecida', () => {
      expect(() => {
        service.createUser(USUARIO_VALIDO.nome, USUARIO_VALIDO.email, null);
      }).toThrow('Nome, email e idade são obrigatórios.');
    });

    test('lança erro ao tentar cadastrar usuário com idade inferior a 18 anos', () => {
      expect(() => {
        service.createUser('Jovem Silva', 'jovem@email.com', 17);
      }).toThrow('O usuário deve ser maior de idade.');
    });

    test('aceita usuário com exatamente 18 anos sem lançar erro', () => {
      expect(() => {
        service.createUser('Dezoito Anos', 'dezoito@email.com', 18);
      }).not.toThrow();
    });
  });

  // ─── getUserById ───────────────────────────────────────────────────────────

  describe('getUserById', () => {
    test('retorna o usuário correspondente ao identificador fornecido', () => {
      const cadastrado = service.createUser(
        USUARIO_VALIDO.nome,
        USUARIO_VALIDO.email,
        USUARIO_VALIDO.idade
      );

      const encontrado = service.getUserById(cadastrado.id);

      expect(encontrado).toBe(cadastrado);
    });

    test('retorna null quando o identificador não corresponde a nenhum usuário', () => {
      const resultado = service.getUserById('id-que-nao-existe');

      expect(resultado).toBeNull();
    });
  });

  // ─── deactivateUser ────────────────────────────────────────────────────────

  describe('deactivateUser', () => {
    test('altera o status do usuário comum para inativo e retorna verdadeiro', () => {
      const usuario = service.createUser('Marcos Lima', 'marcos@email.com', 28);

      const resultado = service.deactivateUser(usuario.id);

      expect(resultado).toBe(true);
      expect(service.getUserById(usuario.id).status).toBe('inativo');
    });

    test('não desativa administrador e retorna falso', () => {
      const admin = service.createUser('Rafaela Admin', 'rafa@email.com', 35, true);

      const resultado = service.deactivateUser(admin.id);

      expect(resultado).toBe(false);
      expect(service.getUserById(admin.id).status).toBe('ativo');
    });

    test('retorna falso ao tentar desativar um identificador inexistente', () => {
      const resultado = service.deactivateUser('id-inexistente');

      expect(resultado).toBe(false);
    });
  });

  // ─── generateUserReport ────────────────────────────────────────────────────

  describe('generateUserReport', () => {
    test('inclui o cabeçalho e os nomes dos usuários cadastrados no relatório', () => {
      service.createUser('Diana Moura', 'diana@email.com', 26);
      service.createUser('Felipe Torres', 'felipe@email.com', 31);

      const relatorio = service.generateUserReport();

      expect(relatorio).toContain('Relatório de Usuários');
      expect(relatorio).toContain('Diana Moura');
      expect(relatorio).toContain('Felipe Torres');
    });

    test('exibe o status de cada usuário no relatório', () => {
      const usuario = service.createUser('Gabi Costa', 'gabi@email.com', 24);
      service.deactivateUser(usuario.id);
      service.createUser('Hélio Ramos', 'helio@email.com', 29);

      const relatorio = service.generateUserReport();

      expect(relatorio).toContain('inativo');
      expect(relatorio).toContain('ativo');
    });

    test('informa ausência de usuários quando nenhum foi cadastrado', () => {
      const relatorio = service.generateUserReport();

      expect(relatorio).toContain('Nenhum usuário cadastrado.');
    });
  });
});