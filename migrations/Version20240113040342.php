<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240113040342 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE cube (id INT AUTO_INCREMENT NOT NULL, user_id INT DEFAULT NULL, cube_data JSON NOT NULL COMMENT \'(DC2Type:json)\', name VARCHAR(255) NOT NULL, INDEX IDX_30FEB1B8A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE `user` (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, password VARCHAR(255) NOT NULL, roles JSON NOT NULL COMMENT \'(DC2Type:json)\', UNIQUE INDEX UNIQ_8D93D649E7927C74 (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE cube ADD CONSTRAINT FK_30FEB1B8A76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE produits_tailles DROP FOREIGN KEY FK_AE885C71AEC613E');
        $this->addSql('ALTER TABLE produits_tailles DROP FOREIGN KEY FK_AE885C7CD11A2CF');
        $this->addSql('ALTER TABLE produits DROP FOREIGN KEY FK_BE2DDF8CC256483C');
        $this->addSql('ALTER TABLE produits DROP FOREIGN KEY FK_BE2DDF8CFD357EFD');
        $this->addSql('ALTER TABLE produits DROP FOREIGN KEY FK_BE2DDF8C5ED47289');
        $this->addSql('ALTER TABLE categories DROP FOREIGN KEY FK_3AF346685CBD743C');
        $this->addSql('ALTER TABLE photos DROP FOREIGN KEY FK_876E0D9CD11A2CF');
        $this->addSql('ALTER TABLE categories_produits DROP FOREIGN KEY FK_68D376B5CD11A2CF');
        $this->addSql('ALTER TABLE categories_produits DROP FOREIGN KEY FK_68D376B5A21214B7');
        $this->addSql('ALTER TABLE produits_categories DROP FOREIGN KEY FK_3A9B64EDA21214B7');
        $this->addSql('ALTER TABLE produits_categories DROP FOREIGN KEY FK_3A9B64EDCD11A2CF');
        $this->addSql('ALTER TABLE tailles DROP FOREIGN KEY FK_337A271EFD357EFD');
        $this->addSql('DROP TABLE produits_tailles');
        $this->addSql('DROP TABLE couleurs');
        $this->addSql('DROP TABLE produits');
        $this->addSql('DROP TABLE marques');
        $this->addSql('DROP TABLE categories');
        $this->addSql('DROP TABLE tailles_types');
        $this->addSql('DROP TABLE photos');
        $this->addSql('DROP TABLE categories_produits');
        $this->addSql('DROP TABLE produits_categories');
        $this->addSql('DROP TABLE tailles');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE produits_tailles (id INT AUTO_INCREMENT NOT NULL, produits_id INT DEFAULT NULL, tailles_id INT DEFAULT NULL, INDEX IDX_AE885C71AEC613E (tailles_id), INDEX IDX_AE885C7CD11A2CF (produits_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE couleurs (id INT AUTO_INCREMENT NOT NULL, couleur VARCHAR(30) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE produits (id INT AUTO_INCREMENT NOT NULL, tailles_types_id INT NOT NULL, marques_id INT NOT NULL, couleurs_id INT DEFAULT NULL, reference VARCHAR(50) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, denomination VARCHAR(150) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, description LONGTEXT CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, prix NUMERIC(6, 2) DEFAULT NULL, prix_public_conseille NUMERIC(6, 2) DEFAULT NULL, prix_promo NUMERIC(6, 2) DEFAULT NULL, promo_date_debut DATETIME DEFAULT NULL, promo_date_fin DATETIME DEFAULT NULL, publie SMALLINT DEFAULT NULL, INDEX IDX_BE2DDF8CFD357EFD (tailles_types_id), INDEX IDX_BE2DDF8CC256483C (marques_id), INDEX IDX_BE2DDF8C5ED47289 (couleurs_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE marques (id INT AUTO_INCREMENT NOT NULL, denomination VARCHAR(100) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, description LONGTEXT CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, logo VARCHAR(20) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE categories (id INT AUTO_INCREMENT NOT NULL, categorie_parente_id INT DEFAULT NULL, libelle VARCHAR(150) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, INDEX IDX_3AF346685CBD743C (categorie_parente_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE tailles_types (id INT AUTO_INCREMENT NOT NULL, type VARCHAR(50) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_unicode_ci`, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE photos (id INT AUTO_INCREMENT NOT NULL, produits_id INT NOT NULL, photo VARCHAR(100) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, ordre_affichage SMALLINT DEFAULT NULL, INDEX IDX_876E0D9CD11A2CF (produits_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE categories_produits (categories_id INT NOT NULL, produits_id INT NOT NULL, INDEX IDX_68D376B5CD11A2CF (produits_id), INDEX IDX_68D376B5A21214B7 (categories_id), PRIMARY KEY(categories_id, produits_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE produits_categories (produits_id INT NOT NULL, categories_id INT NOT NULL, INDEX IDX_3A9B64EDCD11A2CF (produits_id), INDEX IDX_3A9B64EDA21214B7 (categories_id), PRIMARY KEY(produits_id, categories_id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('CREATE TABLE tailles (id INT AUTO_INCREMENT NOT NULL, tailles_types_id INT DEFAULT NULL, libelle VARCHAR(20) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_unicode_ci`, INDEX IDX_337A271EFD357EFD (tailles_types_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB COMMENT = \'\' ');
        $this->addSql('ALTER TABLE produits_tailles ADD CONSTRAINT FK_AE885C71AEC613E FOREIGN KEY (tailles_id) REFERENCES tailles (id)');
        $this->addSql('ALTER TABLE produits_tailles ADD CONSTRAINT FK_AE885C7CD11A2CF FOREIGN KEY (produits_id) REFERENCES produits (id)');
        $this->addSql('ALTER TABLE produits ADD CONSTRAINT FK_BE2DDF8CC256483C FOREIGN KEY (marques_id) REFERENCES marques (id)');
        $this->addSql('ALTER TABLE produits ADD CONSTRAINT FK_BE2DDF8CFD357EFD FOREIGN KEY (tailles_types_id) REFERENCES tailles_types (id)');
        $this->addSql('ALTER TABLE produits ADD CONSTRAINT FK_BE2DDF8C5ED47289 FOREIGN KEY (couleurs_id) REFERENCES couleurs (id)');
        $this->addSql('ALTER TABLE categories ADD CONSTRAINT FK_3AF346685CBD743C FOREIGN KEY (categorie_parente_id) REFERENCES categories (id)');
        $this->addSql('ALTER TABLE photos ADD CONSTRAINT FK_876E0D9CD11A2CF FOREIGN KEY (produits_id) REFERENCES produits (id)');
        $this->addSql('ALTER TABLE categories_produits ADD CONSTRAINT FK_68D376B5CD11A2CF FOREIGN KEY (produits_id) REFERENCES produits (id)');
        $this->addSql('ALTER TABLE categories_produits ADD CONSTRAINT FK_68D376B5A21214B7 FOREIGN KEY (categories_id) REFERENCES categories (id)');
        $this->addSql('ALTER TABLE produits_categories ADD CONSTRAINT FK_3A9B64EDA21214B7 FOREIGN KEY (categories_id) REFERENCES categories (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE produits_categories ADD CONSTRAINT FK_3A9B64EDCD11A2CF FOREIGN KEY (produits_id) REFERENCES produits (id) ON DELETE CASCADE');
        $this->addSql('ALTER TABLE tailles ADD CONSTRAINT FK_337A271EFD357EFD FOREIGN KEY (tailles_types_id) REFERENCES tailles_types (id)');
        $this->addSql('ALTER TABLE cube DROP FOREIGN KEY FK_30FEB1B8A76ED395');
        $this->addSql('DROP TABLE cube');
        $this->addSql('DROP TABLE `user`');
    }
}
