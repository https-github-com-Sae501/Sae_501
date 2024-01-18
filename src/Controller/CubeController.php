<?php

namespace App\Controller;

use App\Entity\Sculpt;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/sculpts', name: '')]
class CubeController extends AbstractController
{
    private $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    #[Route('', name: 'save_cube', methods: ['POST'])]
    public function createSculpt(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        // Votre logique pour créer un cube

        return $this->json(['message' => 'Cube enregistré avec succès!']);
    }

    #[Route('', name: 'get_sculpts', methods: ['GET'])]
    public function getSculptsForCurrentUser(EntityManagerInterface $entityManager): JsonResponse
    {
        try {
            // Récupérer l'utilisateur actuellement authentifié
            $user = $this->getUser();

            // Vérifier si l'utilisateur est authentifié
            if (!$user) {
                return $this->json(['message' => 'Unauthorized'], 401);
            }

            // Récupérer les cubes pour l'utilisateur actuel
            $sculpts = $entityManager->getRepository(Sculpt::class)->findBy(['user' => $user]);

            // Vous pouvez personnaliser le format de réponse selon vos besoins
            return $this->json(['cubes' => $sculpts]);
        } catch (\Exception $e) {
            // Log detailed error information
            $this->logger->error('Error getting cubes: ' . $e->getMessage(), [
                'exception' => $e,
            ]);

            return $this->json(['error' => 'Une erreur s\'est produite lors de la récupération des cubes.'], 500);
        }
    }
}
