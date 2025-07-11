## 📚 Livraria Barrilli – Guia End-to-End

---
### Stack & Pré-requisitos

| Camada            | Tech                       | Versão mín. | Como instalar                                      |
| ----------------- | -------------------------- | ----------- | -------------------------------------------------- |
| Backend           | **Java 17**, Spring Boot 3 | 17 LTS      | JDK Temurin / OpenJDK                              |
| Banco             | PostgreSQL                 | 15          | site oficial ou container             |
| Frontend          | Node.js                    | 20.x LTS    | [https://nodejs.org](https://nodejs.org)           |
| Build             | Maven **ou** Gradle        | 3.9 / 8.6   | já vem no wrapper                                  |
| Docker (opcional) | Docker Engine, Compose     | 24+         | [https://docs.docker.com](https://docs.docker.com) |

> **Dica:** use Docker para evitar “works on my machine”.

---

### 2. Variáveis de Ambiente

Crie um arquivos na raiz do projeto:



* **`frontend/.env`**

  ```env
  VITE_API_URL=http://localhost:8080/api/livros
  ```
  
E edite no seu backend application.yml:
  
* **`backend/`**

  ```
  SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/livraria
  SPRING_DATASOURCE_USERNAME=livraria
  SPRING_DATASOURCE_PASSWORD=livraria
  ```

O Docker Compose (passo 5) carrega esses valores automaticamente.

---

### 3. Backend (Spring Boot)

```bash
cd backend

# 3.1 Subir PostgreSQL local (só dev)
docker compose up -d db   # ou `docker run` simples

# 3.2 Compilar e rodar
./mvnw spring-boot:run     # Maven wrapper
# ou
./gradlew bootRun          # Gradle wrapper
```

A API estará em **`http://localhost:8080/api/livros`**.

**Endpoints principais**

| Método | URI                              | Descrição                                  |
| ------ | -------------------------------- | ------------------------------------------ |
| GET    | `/api/livros`                    | Lista paginada + filtros `titulo`, `autor` |
| GET    | `/api/livros/buscar-por-id/{id}` | Busca por ID                               |
| POST   | `/api/livros`                    | Criar                                      |
| PUT    | `/api/livros/atualizar/{id}`     | Atualizar                                  |
| DELETE | `/api/livros/deletar/{id}`       | Remover                                    |

---

### 4. Frontend (React + Vite)

```bash
cd frontend\book-catalog
npm install                # instala dependências
npm run dev                # abre em http://localhost:5173
```

> Se o backend estiver em outra porta/origem, atualize `VITE_API_URL`.

---

### 5. Docker Compose (Full Stack)

Rodar tudo em um comando:

```bash
docker compose up --build
```

* **`frontend`** exposto em `localhost:5173`
* **`backend`** exposto em `localhost:8080`
* **`db`** persistido em volume `postgres_data`

Arquivo `docker-compose.yml` já incluso na raiz – revise portas se necessário.

---

**Pronto!** Com esses passos você compila, roda, testa e entrega valor na Livraria Barrilli sem sustos. Qualquer dúvida, abra uma issue ou me chame.
