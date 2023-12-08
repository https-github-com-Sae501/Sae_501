<?php

// src/Controller/AuthController.php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Symfony\Component\Security\Core\User\UserInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/authentication_token', name: 'token')]
class AuthController extends AbstractController
{
    private $jwtTokenManager;

    public function __construct(JWTTokenManagerInterface $jwtTokenManager)
    {
        $this->jwtTokenManager = $jwtTokenManager;
    }

    #[Route('', methods: ['POST'])]
    public function getToken(Request $request): JsonResponse
    {
        $user = $this->getUser();

        if (!$user instanceof UserInterface) {
            throw new BadCredentialsException('Invalid credentials');
        }

        // Generate a JWT token
        $token = $this->jwtTokenManager->create($user);

        // Return the token as JSON
        return $this->json(['token' => $token]);
    }
}
