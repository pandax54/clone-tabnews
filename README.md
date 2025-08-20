starting new project

🔧 Testing the Connection

Start your containers:

```
docker-compose up
```

Test database connection from inside the Next.js container:

```
docker-compose exec next-app sh
# Inside the container:
ping database  # Should resolve to the database container IP
```

Connect to database from your host:

```
psql -h localhost -p 5001 -U local_postgres -d local_postgres
```

Use the Makefile commands for easy management:

make dev-up - Start development environment
make test - Run all tests in Docker
make prod-up - Deploy to production
make migrate-prod - Run production migrations
