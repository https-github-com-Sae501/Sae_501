<?php

namespace App\Controller;

use App\Entity\Cube;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/cubes', name: '')]
class CubeController extends AbstractController
{
    private $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    #[Route('', name: 'save_cube', methods: ['POST'])]
    public function createCube(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        // Votre logique pour créer un cube

        return $this->json(['message' => 'Cube enregistré avec succès!']);
    }

    #[Route('', name: 'get_cubes', methods: ['GET'])]
    public function getCubesForCurrentUser(EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            // Récupérer l'utilisateur actuellement authentifié
            $user = $this->getUser();

            // Vérifier si l'utilisateur est authentifié
            if (!$user) {
                return $this->json(['message' => 'Unauthorized'], 401);
            }

            // Récupérer les cubes pour l'utilisateur actuel
            $cubes = $entityManager->getRepository(Cube::class)->findBy(['user' => $user]);

            // Vous pouvez personnaliser le format de réponse selon vos besoins
            return $this->json(['cubes' => $cubes]);
        } catch (\Exception $e) {
            // Log detailed error information
            $this->logger->error('Error getting cubes: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return $this->json(['error' => 'Une erreur s\'est produite lors de la récupération des cubes.'], 500);
        }
    }
}
