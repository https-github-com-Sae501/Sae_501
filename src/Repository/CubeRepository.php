<?php

namespace App\Repository;

use App\Entity\Cube;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Cube>
 *
 * @method Cube|null find($id, $lockMode = null, $lockVersion = null)
 * @method Cube|null findOneBy(array $criteria, array $orderBy = null)
 * @method Cube[]    findAll()
 * @method Cube[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class CubeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Cube::class);
    }

//    /**
//     * @return Cube[] Returns an array of Cube objects
//     */
//    public function findByExampleField($value): array
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->orderBy('c.id', 'ASC')
//            ->setMaxResults(10)
//            ->getQuery()
//            ->getResult()
//        ;
//    }

//    public function findOneBySomeField($value): ?Cube
//    {
//        return $this->createQueryBuilder('c')
//            ->andWhere('c.exampleField = :val')
//            ->setParameter('val', $value)
//            ->getQuery()
//            ->getOneOrNullResult()
//        ;
//    }
}
