BEGIN TRANSACTION;
CREATE TABLE [Tenants] (
    [Id] int NOT NULL IDENTITY,
    [Name] nvarchar(max) NOT NULL,
    [Slug] nvarchar(450) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_Tenants] PRIMARY KEY ([Id])
);

SET IDENTITY_INSERT [Tenants] ON;
INSERT INTO [Tenants] ([Id], [Name], [Slug], [CreatedAt])
VALUES (1, 'Default', 'default', SYSUTCDATETIME());
SET IDENTITY_INSERT [Tenants] OFF;

DECLARE @var sysname;
SELECT @var = [d].[name]
FROM [sys].[default_constraints] [d]
INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Users]') AND [c].[name] = N'Username');
IF @var IS NOT NULL EXEC(N'ALTER TABLE [Users] DROP CONSTRAINT [' + @var + '];');
ALTER TABLE [Users] ALTER COLUMN [Username] nvarchar(450) NOT NULL;

ALTER TABLE [Users] ADD [TenantId] int NOT NULL DEFAULT 1;

ALTER TABLE [Sales] ADD [TenantId] int NOT NULL DEFAULT 1;

ALTER TABLE [SaleDetails] ADD [TenantId] int NOT NULL DEFAULT 1;

ALTER TABLE [Products] ADD [TenantId] int NOT NULL DEFAULT 1;

ALTER TABLE [PendingSales] ADD [TenantId] int NOT NULL DEFAULT 1;

ALTER TABLE [PendingSaleDetails] ADD [TenantId] int NOT NULL DEFAULT 1;

ALTER TABLE [InventoryMovement] ADD [TenantId] int NOT NULL DEFAULT 1;

ALTER TABLE [Categories] ADD [TenantId] int NOT NULL DEFAULT 1;

CREATE INDEX [IX_Users_TenantId] ON [Users] ([TenantId]);

CREATE UNIQUE INDEX [IX_Users_Username] ON [Users] ([Username]);

CREATE INDEX [IX_Sales_TenantId] ON [Sales] ([TenantId]);

CREATE INDEX [IX_SaleDetails_TenantId] ON [SaleDetails] ([TenantId]);

CREATE INDEX [IX_Products_TenantId] ON [Products] ([TenantId]);

CREATE INDEX [IX_PendingSales_TenantId] ON [PendingSales] ([TenantId]);

CREATE INDEX [IX_PendingSaleDetails_TenantId] ON [PendingSaleDetails] ([TenantId]);

CREATE INDEX [IX_InventoryMovement_TenantId] ON [InventoryMovement] ([TenantId]);

CREATE INDEX [IX_Categories_TenantId] ON [Categories] ([TenantId]);

CREATE UNIQUE INDEX [IX_Tenants_Slug] ON [Tenants] ([Slug]);

ALTER TABLE [Categories] ADD CONSTRAINT [FK_Categories_Tenants_TenantId] FOREIGN KEY ([TenantId]) REFERENCES [Tenants] ([Id]) ON DELETE NO ACTION;

ALTER TABLE [InventoryMovement] ADD CONSTRAINT [FK_InventoryMovement_Tenants_TenantId] FOREIGN KEY ([TenantId]) REFERENCES [Tenants] ([Id]) ON DELETE NO ACTION;

ALTER TABLE [PendingSaleDetails] ADD CONSTRAINT [FK_PendingSaleDetails_Tenants_TenantId] FOREIGN KEY ([TenantId]) REFERENCES [Tenants] ([Id]) ON DELETE NO ACTION;

ALTER TABLE [PendingSales] ADD CONSTRAINT [FK_PendingSales_Tenants_TenantId] FOREIGN KEY ([TenantId]) REFERENCES [Tenants] ([Id]) ON DELETE NO ACTION;

ALTER TABLE [Products] ADD CONSTRAINT [FK_Products_Tenants_TenantId] FOREIGN KEY ([TenantId]) REFERENCES [Tenants] ([Id]) ON DELETE NO ACTION;

ALTER TABLE [SaleDetails] ADD CONSTRAINT [FK_SaleDetails_Tenants_TenantId] FOREIGN KEY ([TenantId]) REFERENCES [Tenants] ([Id]) ON DELETE NO ACTION;

ALTER TABLE [Sales] ADD CONSTRAINT [FK_Sales_Tenants_TenantId] FOREIGN KEY ([TenantId]) REFERENCES [Tenants] ([Id]) ON DELETE NO ACTION;

ALTER TABLE [Users] ADD CONSTRAINT [FK_Users_Tenants_TenantId] FOREIGN KEY ([TenantId]) REFERENCES [Tenants] ([Id]) ON DELETE NO ACTION;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260602042316_AddMultitenancy', N'9.0.10');

COMMIT;
GO

