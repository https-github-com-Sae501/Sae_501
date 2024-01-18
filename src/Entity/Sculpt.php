<?php

namespace App\Entity;

use App\Repository\CubeRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;



#[ORM\Entity(repositoryClass: CubeRepository::class)]
#[ApiResource]
class Sculpt
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private array $cubeData = [];

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\ManyToOne(inversedBy: 'cubes')]
    private ?User $user = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCubeData(): array
    {
        return $this->cubeData;
    }

    public function setCubeData(array $cubeData): static
    {
        $this->cubeData = $cubeData;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

}
