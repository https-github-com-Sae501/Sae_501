<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface ; 
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;

#[Route('/api/users')]
class UserController extends AbstractController
{
    private $entityManager;
    private $passwordEncoder;

    public function __construct(EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordEncoder)
    {
        $this->entityManager = $entityManager;
        $this->passwordEncoder = $passwordEncoder;
    }

#[Route('', methods: ['POST'])]
public function createUser(Request $request): JsonResponse
{
    $data = json_decode($request->getContent(), true);

    if (!isset($data['email']) || !isset($data['password'])) {
        return $this->json(['message' => 'Invalid JSON format'], 400);
    }

    // Créer une instance d'utilisateur
    $user = new User();
    $user->setEmail($data['email']);

    // Hasher le mot de passe
    $hashedPassword = $this->passwordEncoder->hashPassword($user, $data['password']);
    $user->setPassword($hashedPassword);

    // Autres propriétés...

    // Persister l'utilisateur dans la base de données
    $this->entityManager->persist($user);
    $this->entityManager->flush();

    return $this->json(['message' => 'User created successfully'], 201);
    }
}
