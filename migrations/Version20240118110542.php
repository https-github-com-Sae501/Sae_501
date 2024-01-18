<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240118110542 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE sculpt (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, cube_data JSON NOT NULL COMMENT \'(DC2Type:json)\', name VARCHAR(255) NOT NULL, INDEX IDX_879D7D68A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE sculpt ADD CONSTRAINT FK_879D7D68A76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE cube DROP FOREIGN KEY FK_30FEB1B8A76ED395');
        $this->addSql('DROP TABLE cube');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE cube (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, cube_data JSON NOT NULL COMMENT \'(DC2Type:json)\', name VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, INDEX IDX_30FEB1B8A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE cube ADD CONSTRAINT FK_30FEB1B8A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE sculpt DROP FOREIGN KEY FK_879D7D68A76ED395');
        $this->addSql('DROP TABLE sculpt');
    }
}
